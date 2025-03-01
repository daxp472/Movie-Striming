import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

type ApiFunction<T, P> = (params: P) => Promise<T>;

export function useApi<T, P = any>(apiFunction: ApiFunction<T, P>) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (params: P, showToast = true) => {
      setState(prevState => ({ ...prevState, isLoading: true, error: null }));
      
      try {
        const data = await apiFunction(params);
        setState({ data, isLoading: false, error: null });
        return { data, error: null };
      } catch (error) {
        const errorObj = error as Error;
        setState({ data: null, isLoading: false, error: errorObj });
        
        if (showToast) {
          toast.error(errorObj.message || 'An error occurred');
        }
        
        return { data: null, error: errorObj };
      }
    },
    [apiFunction]
  );

  return {
    ...state,
    execute,
    reset: useCallback(() => {
      setState({ data: null, isLoading: false, error: null });
    }, []),
  };
}

export function useLazyApi<T, P = any>(apiFunction: ApiFunction<T, P>) {
  return useApi<T, P>(apiFunction);
}

export function useQueryApi<T, P = any>(
  apiFunction: ApiFunction<T, P>,
  params: P,
  dependencies: any[] = [],
  options = { enabled: true, showToast: true }
) {
  const api = useApi<T, P>(apiFunction);
  
  const { enabled = true, showToast = true } = options;
  
  const fetchData = useCallback(async () => {
    if (enabled) {
      await api.execute(params, showToast);
    }
  }, [api, enabled, params, showToast, ...dependencies]);
  
  useState(() => {
    fetchData();
  });
  
  return {
    ...api,
    refetch: fetchData,
  };
}
