import styles from './button.module.css';

export default function button({text}) {
  return (
     <div class={styles.centre}>
      <button type="button" className={styles.commonbutton}>
        <div class={styles.top}>{text}</div>
        <div class={styles.bottom}></div>
      </button>
    </div>
  )
}
