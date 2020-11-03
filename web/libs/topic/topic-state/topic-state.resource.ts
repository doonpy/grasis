import ArrowAltCircleDown from '../../../assets/svg/regular/arrow-alt-circle-down.svg';
import BanIcon from '../../../assets/svg/regular/ban.svg';
import CheckCircleIcon from '../../../assets/svg/regular/check-circle.svg';
import MinusCircleIcon from '../../../assets/svg/regular/minus-circle.svg';
import PlusCircleIcon from '../../../assets/svg/regular/plus-circle.svg';
import SendBackIcon from '../../../assets/svg/regular/send-back.svg';
import StampIcon from '../../../assets/svg/regular/stamp.svg';
import { TopicTerminology } from '../../../assets/terminology/topic.terminology';

export enum TopicStateAction {
  NEW = 1,
  APPROVED,
  REJECTED,
  SEND_BACK,
  WITHDRAW,
  CONFIRMED,
  SEND_REQUEST,
  CANCELED
}

export const TopicStateActionText = [
  '',
  TopicTerminology.TOPIC_25,
  TopicTerminology.TOPIC_22,
  TopicTerminology.TOPIC_23,
  TopicTerminology.TOPIC_24,
  TopicTerminology.TOPIC_26,
  TopicTerminology.TOPIC_27,
  TopicTerminology.TOPIC_28,
  TopicTerminology.TOPIC_29
];

export const TopicStateActionColor = [
  '',
  'blue',
  'green',
  'red',
  'gray',
  'cyan',
  'green',
  'gold',
  'red'
];

export const TopicStateActionIcon = [
  '',
  PlusCircleIcon,
  CheckCircleIcon,
  MinusCircleIcon,
  SendBackIcon,
  ArrowAltCircleDown,
  CheckCircleIcon,
  StampIcon,
  BanIcon
];
