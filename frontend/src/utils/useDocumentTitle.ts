import { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setRouteTitle } from '../dashboard/pageTitleSlice';

function useDocumentTitle(title: string, prevailOnUnmount = false) {
  const defaultTitle = useRef(document.title);
  const dispatch = useDispatch();
  useEffect(() => {
    document.title = title;
    dispatch(setRouteTitle(title));
  }, [title]);

  useEffect(
    () => () => {
      if (!prevailOnUnmount) {
        document.title = defaultTitle.current;
      }
    },
    []
  );
}

export default useDocumentTitle;
