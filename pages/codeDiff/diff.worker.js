importScripts('../../common/jsdiff/diff.min.js')

self.onmessage = function (e) {
    const { id, text1, text2 } = e.data
    self.postMessage({ id, diff: Diff.diffWords(text1, text2) })
}
