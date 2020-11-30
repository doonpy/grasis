import ArrowAltCircleDown from '../../../assets/svg/regular/arrow-alt-circle-down.svg';
import CheckCircleIcon from '../../../assets/svg/regular/check-circle.svg';
import MinusCircleIcon from '../../../assets/svg/regular/minus-circle.svg';
import PlusCircleIcon from '../../../assets/svg/regular/plus-circle.svg';
import StampIcon from '../../../assets/svg/regular/stamp.svg';
import TimesCircleIcon from '../../../assets/svg/regular/times-circle.svg';
import UndoAltIcon from '../../../assets/svg/regular/undo-alt.svg';
import { CommonTerminology } from '../../../assets/terminology/common.terminology';
import { TopicTerminology } from '../../../assets/terminology/topic.terminology';

export enum TopicStateAction {
  NEW = 1,
  APPROVED,
  REJECTED,
  SEND_BACK,
  WITHDRAW,
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
  TopicTerminology.TOPIC_28,
  TopicTerminology.TOPIC_29
];

export const TopicStateActionColor = ['', 'blue', 'green', 'red', 'gray', 'cyan', 'gold', 'red'];

export const TopicStateActionIcon = [
  '',
  PlusCircleIcon,
  CheckCircleIcon,
  MinusCircleIcon,
  UndoAltIcon,
  ArrowAltCircleDown,
  StampIcon,
  TimesCircleIcon
];

export enum StateResult {
  NOT_DECIDED = 1,
  TRUE,
  FALSE
}

export const StateResultText = [
  '',
  CommonTerminology.COMMON_8,
  CommonTerminology.COMMON_6,
  CommonTerminology.COMMON_7
];

export const StateResultColor = ['', 'gray', 'green', 'red'];
