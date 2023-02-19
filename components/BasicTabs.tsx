import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface Props {
  value: number;
  tabs: Array<{ label: string; }>;
  onChange: (event: React.SyntheticEvent, newValue: number) => any;
  children: JSX.Element | JSX.Element[];
}

const BasicTabs: React.FC<Props> = ({ value, tabs, children, onChange }) => {
  return (<Box sx={{ width: '100%' }}>
  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    <Tabs value={value} onChange={onChange} aria-label="basic tabs">
      {tabs.map((tab, index: number) => (
        <Tab label={tab.label} key={index} {...a11yProps(0)} />
      ))}
    </Tabs>
  </Box>
  { React.Children.toArray(children) }
</Box>)
}

export default BasicTabs;