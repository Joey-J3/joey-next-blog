import { useEffect, useReducer, useCallback, useRef, MutableRefObject } from "react";
import debounce from "lodash/debounce";

const INTERSECTION_THRESHOLD = 5;
const LOAD_DELAY_MS = 500;

interface IState {
  loading: boolean;
  data: Array<any>;
  currentPage: number;
  isLastPage: boolean;
}

export enum ACTION_TYPE_ENUM {
  SET = "set",
  ON_GRAB_DATA = "onGrabData",
}

export interface IAction {
  type: ACTION_TYPE_ENUM,
  payload: Partial<IState>,
}

export const defaultState: IState = {
  loading: false,
  data: [],
  currentPage: 1,
  isLastPage: false
}

export const reducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case "set": {
      return {
        ...state,
        ...action.payload
      };
    }
    case "onGrabData": {
      return {
        ...state,
        loading: false,
        data: [...state.data, ...(action.payload.data as [])],
        currentPage: state.currentPage + 1
      };
    }
    default:
      return state;
  }
};

interface IUseLazyLoad {
  defaultState?: Partial<IState>;
  triggerRef: MutableRefObject<any>;
  onGrabData: (pageNum: number) => Array<any> | Promise<Array<any>>;
  options?: IntersectionObserverInit | undefined;
}

const useLazyLoad = ({ defaultState, triggerRef, onGrabData, options }: IUseLazyLoad) => {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    currentPage: 1,
    data: [],
    isLastPage: false,
    ...defaultState
  });

  const _handleEntry = async (entry: IntersectionObserverEntry) => {
    const boundingRect = entry.boundingClientRect;
    const intersectionRect = entry.intersectionRect;

    if (
      !state.isLastPage &&
      !state.loading &&
      entry.isIntersecting &&
      intersectionRect.bottom - boundingRect.bottom <= INTERSECTION_THRESHOLD
    ) {
      dispatch({ type: ACTION_TYPE_ENUM.SET, payload: { loading: true } });
      const data = await onGrabData(state.currentPage);
      if (data && data.length === 0) {
        dispatch({ type: ACTION_TYPE_ENUM.SET, payload: { loading: false, isLastPage: true }})
        return
      }
      dispatch({ type: ACTION_TYPE_ENUM.ON_GRAB_DATA, payload: { data } });
    }
  };
  const handleEntry = debounce(_handleEntry, LOAD_DELAY_MS);

  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      handleEntry(entries[0]);
    },
    [handleEntry]
  );

  useEffect(() => {
    if (triggerRef.current) {
      const container = triggerRef.current;
      const observer = new IntersectionObserver(onIntersect, options);

      observer.observe(container);

      return () => {
        observer.disconnect();
      };
    }
  }, [triggerRef, onIntersect, options]);

  return state;
};

export default useLazyLoad;
