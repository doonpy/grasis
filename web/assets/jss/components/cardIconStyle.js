import {
  dangerCardHeader,
  darkCardHeader,
  grayColor,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
  successCardHeader,
  warningCardHeader
} from '../global.js';

const cardIconStyle = {
  cardIcon: {
    '&$warningCardHeader,&$successCardHeader,&$dangerCardHeader,&$infoCardHeader,&$primaryCardHeader,&$roseCardHeader,&$darkCardHeader': {
      borderRadius: '3px',
      backgroundColor: grayColor[0],
      padding: '15px',
      marginTop: '-20px',
      marginRight: '15px',
      float: 'left'
    }
  },
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader,
  roseCardHeader,
  darkCardHeader
};

export default cardIconStyle;
