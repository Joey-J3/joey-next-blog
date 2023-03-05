import { ActionType } from 'context/types';
import { useRouter } from 'next/router';
import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { ActionEnum } from './actions';

type SearchActionType = ActionType<ActionEnum, Partial<ISearchState>>;

interface ISearchState {
  executor: (params?: any) => Promise<any> | any;
  searchParams?: any;
  lastSearchParams?: any;
  searchText: string;
  data: Array<any>;
  loading: boolean;
  dispatch: React.Dispatch<SearchActionType>;
}

const initialState: ISearchState = {
  executor: () => {},
  searchParams: {},
  lastSearchParams: {},
  searchText: '',
  data: [],
  loading: false,
  dispatch: (action: SearchActionType) => {},
};

export const SearchContext = createContext<ISearchState>(initialState);

export const reducer = (state: ISearchState, action: SearchActionType): ISearchState => {
  switch (action.type) {
    case ActionEnum.SET_SEARCH:
      return {
        ...state,
        executor: action.payload?.executor || initialState.executor,
      };
    case ActionEnum.SET_DATA:
      return {
        ...state,
        data: action.payload?.data || [],
      };
    case ActionEnum.SET_LOADING:
      return {
        ...state,
        loading: action.payload?.loading || false,
      };
    case ActionEnum.SET_LAST_PARAMS:
      return {
        ...state,
        lastSearchParams: action.payload?.lastSearchParams,
      };
    case ActionEnum.SET_PARAMS:
      return {
        ...state,
        searchParams: action.payload?.searchParams,
      };
    case ActionEnum.SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.payload?.searchText || '',
      };
    case ActionEnum.SET_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};

interface ISearchProvider {
  children: JSX.Element;
}

export const SearchProvider = ({ children }: ISearchProvider) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <SearchContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export function useSearchContext() {
  const { executor, data, searchText, loading, dispatch } = useContext(SearchContext);
  const initState = useCallback(
    (defaultState: Partial<ISearchState>) => {
      dispatch({
        type: ActionEnum.SET_STATE,
        payload: defaultState,
      });
    },
    [dispatch],
  );
  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch({
        type: ActionEnum.SET_LOADING,
        payload: {
          loading,
        },
      });
    },
    [dispatch],
  );
  const setData = useCallback(
    (data: any) => {
      dispatch({
        type: ActionEnum.SET_DATA,
        payload: {
          data,
        },
      });
    },
    [dispatch],
  );
  const setParams = useCallback(
    (searchParams: any) => {
      dispatch({
        type: ActionEnum.SET_PARAMS,
        payload: {
          lastSearchParams: searchParams,
        },
      });
    },
    [dispatch],
  );
  const handleSearch = useCallback(async () => {
    setLoading(true);
    const data = await executor(searchText);
    setData(data);
    setLoading(false);
  }, [executor, setLoading, setData, searchText]);

  const setSearchText = useCallback(
    (value: ISearchState['searchText']) => {
      dispatch({
        type: ActionEnum.SET_SEARCH_TEXT,
        payload: {
          searchText: value,
        },
      });
    },
    [dispatch],
  );
  const setExecutor = useCallback(
    (executor: ISearchState['executor']) => {
      dispatch({
        type: ActionEnum.SET_SEARCH,
        payload: {
          executor,
        },
      });
    },
    [dispatch],
  );

  return {
    initState,
    handleSearch,
    setSearchText,
    setExecutor,
    setParams,
    loading,
    searchText,
    data,
    dispatch,
  };
}
