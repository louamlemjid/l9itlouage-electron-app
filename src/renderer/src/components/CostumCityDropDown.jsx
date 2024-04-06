import React from 'react';

const CustomCityDropdown = ({ options }) => {
  return (
    <datalist id="custom-options" >
      {options.map((option, index) => (
        <option key={index} value={option} />
      ))}
    </datalist>
  );
};

export default CustomCityDropdown;
