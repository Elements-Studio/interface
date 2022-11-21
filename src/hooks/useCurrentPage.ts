import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { routes, TRoute } from 'App.routes';

const useCurrentPage = () => {
  const { pathname } = useLocation();
  const [selectedKey, setSelectedKey] = useState<TRoute['name']>('Home');

  const rootPath = pathname.split('/')[1];
  console.log(`current pathname: ${pathname}, rootpath: ${rootPath}`);
  const pageName =
    routes?.find((r) => {
      const pathStart = r.path.split('/')[0];
      return pathStart === rootPath;
    })?.name || routes[0].name;
  if (pageName !== selectedKey) {
    setSelectedKey(pageName);
  }

  return [selectedKey];
};

export default useCurrentPage;
