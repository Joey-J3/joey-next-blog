import { useEffect, useReducer, useCallback, MutableRefObject } from "react";
import debounce from "lodash/debounce";

const INTERSECTION_THRESHOLD = 5;
const LOAD_DELAY_MS = 500;

interface IState {
  loading: boolean;
  data: Array<any>;
  isLastPage: boolean;
  pagination: {
    pageSize?: number,
    current: number,
  };
}

export enum ACTION_TYPE_ENUM {
  SET = "set",
  ON_GRAB_DATA = "onGrabData",
}

export interface IAction {
  type: ACTION_TYPE_ENUM,
  payload: Partial<IState>,
}

export const initialState: IState = {
  loading: false,
  data: [],
  isLastPage: false,
  pagination: {
    current: 1,
    pageSize: 10
  }
}

export const reducer = (state: IState, action: IAction): IState => {
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
        pagination: {
          current: state.pagination.current + 1
        },
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
    ...initialState,
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
      const data = await onGrabData(state.pagination.current);
      dispatch({ type: ACTION_TYPE_ENUM.ON_GRAB_DATA, payload: { data } });
      if (data && (data.length === 0 || (state.pagination.pageSize && state.pagination.pageSize > data.length))) {
        dispatch({ type: ACTION_TYPE_ENUM.SET, payload: { loading: false, isLastPage: true } })
      }
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

  return { ...state, dispatch };
};

export default useLazyLoad;

export const LoadingCard: React.FC = () => {
  return (
    <div className="w-full rounded overflow-hidden shadow-lg m-2">
      <div className="w-full h-64 bg-gray-300 animate-pulse"></div>
      <div className="px-6 py-4 items-center">
        <div className="font-regular text-xl mb-2 w-20 h-4 bg-gray-300 animate-pulse"></div>
      </div>
    </div>
  );
};

export const LoadingCardList = () => {
  const loadPages = [1, 2, 3, 4, 5, 6];
  return (
    <div className="grid grid-cols-3 gap-4 content-start">
      {loadPages.map((num) => {
        return <LoadingCard key={num} />;
      })}
    </div>
  );
};