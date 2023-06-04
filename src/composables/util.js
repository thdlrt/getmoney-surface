import { ElNotification, ElMessageBox } from 'element-plus'
import { search } from '~/api/data.js'
import nprogress from 'nprogress'
//成功提示
export function toast(message, type = 'success') {
    ElNotification({
        message,
        type,
        duration: 2500
    })
}
//确认提示
export function showModal(content, type="warning", title="") {
    return ElMessageBox.confirm(
        content,
        title,
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type,
        }
      )
}
//网页加载进度条显示
export function startLoading() {
    nprogress.start()
}
//隐藏
export function endLoading() {
    nprogress.done()
}
