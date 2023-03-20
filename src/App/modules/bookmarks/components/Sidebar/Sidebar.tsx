import React from 'react';
const style: React.CSSProperties = {
  height: '100vh',
  flexBasis: '30%',
  minWidth: '256px',
};
const Sidebar = () => {
  return (
    <aside
      id="sidebar"
      className="bg-slate-800 grow-0 shrink"
      style={style}
    ></aside>
  );
};

export default Sidebar;
