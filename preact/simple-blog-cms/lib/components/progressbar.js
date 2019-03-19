import { h } from 'preact';

export default function ProgressBar(props) {
    const styles = props.styles;
    const loadingProgress = props.loadingProgress;
    return (
        <div class={`col-12 progress ${styles.progress}`} style={`opacity: ${loadingProgress === 100 ? 0 : 1};`}>
            <div class={`progress-bar ${styles.progressBar}`} role='progressbar'
                style={`width: ${loadingProgress}%;`}
                aria-valuenow={loadingProgress} aria-valuemin='0' aria-valuemax='100' />
        </div>
    );
}
