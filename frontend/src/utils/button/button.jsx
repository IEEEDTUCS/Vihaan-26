import styles from './button.module.css';

export default function button({text , link, type=false}) {
  return (
     <div className={styles.centre}>
      <button type="button" disabled={type} className={styles.commonbutton} onClick={() => window.open(link, '_blank')}>
        <div className={styles.top}>{text}</div>
        <div className={styles.bottom}></div>
      </button>
    </div>
  )
}
