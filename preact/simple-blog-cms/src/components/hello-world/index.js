import { h, Component } from "preact";
import styles from './style.css';

export default class App extends Component {
  render(props) {
    return (
      <div>
        <h1 style={{ color: props.color }}>Hello, World!</h1>
      </div>
    );
  }
}
