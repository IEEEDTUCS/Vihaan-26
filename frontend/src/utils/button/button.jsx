import styles from './button.module.css';

export default function button({text , link}) {
  return (
     <div className={styles.centre}>
      <button type="button" className={styles.commonbutton} onClick={() => window.open(link, '_blank')}>
        <div className={styles.top}>{text}</div>
        <div className={styles.bottom}></div>
      </button>
    </div>
  )
}
