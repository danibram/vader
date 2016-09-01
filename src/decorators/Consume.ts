import RouteProperty from  '../core/RouteProperty';
import MediaType from  '../enums/MediaType';
import Debugger from '../utils/debug';
import ControllerProperty from '../core/ControllerProperty';
import Property from '../enums/Property';
const CLASS = Property.CLASS;

const debug = Debugger('vader:decorator');

export default function Consume(type: MediaType) {
    return (target, key: string) => {
        debug(`Mounting @Consume(${MediaType.toString(type)})`);
        target[CLASS] = target[CLASS] || new ControllerProperty();
        target[CLASS].ROUTES[key].CONSUME = type;
    }
}
