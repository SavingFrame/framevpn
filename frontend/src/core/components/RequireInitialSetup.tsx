import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { initialSetupApi } from '../../initialSetup/services';

function RequireInitialSetup({ children }: { children: any }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // @ts-ignore
  dispatch(initialSetupApi.endpoints.getConfig.initiate())
    .unwrap()
    .then((data: any) => {
      if (!data.is_configured) {
        navigate(`/initial-setup`);
      }
    });
  return children;
}

export default RequireInitialSetup;
