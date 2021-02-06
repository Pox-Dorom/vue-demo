// 全局过滤器接收一个日期时间返回正确的可读格式
Vue.filter('date', time => moment(time).format('DD/MM/YY, HH:mm'))


new Vue({
  name: 'notebook',

  // 根节点
  el: '#notebook',

  data () {
    return {
      // 获取localStorage数据
      notes: JSON.parse(localStorage.getItem('notes')) || [],
      selectedId: localStorage.getItem('selected-id') || null,
    }
  },


  computed: {
    selectedNote () {
      // 返回与selectedId匹配的笔记
      return this.notes.find(note => note.id === this.selectedId)
    },

    notePreview () {
      // Markdown 转换为 HTML
      return this.selectedNote ? marked(this.selectedNote.content) : ''
    },

    // 按照排序时间和是否收藏自动更新和缓存 进行排序
    sortedNotes () {
      return this.notes.slice().sort((a, b) => a.created - b.created)
      .sort((a, b) => (a.favorite === b.favorite)? 0 : a.favorite? -1 : 1)
    },

    linesCount () {
      if (this.selectedNote) {
        // 计算换行符的个数
        return this.selectedNote.content.split(/\r\n|\r|\n/).length
      }
    },

    wordsCount () {
      if (this.selectedNote) {
        var s = this.selectedNote.content
        // 将换行符转换为空格
        s = s.replace(/\n/g, ' ')
        // 排除开头和结尾的空格
        s = s.replace(/(^\s*)|(\s*$)/gi, '')
        // 将两个以上的空格转换为一个
        s = s.replace(/[ ]{2,}/gi, ' ')
        // 返回空格数量
        return s.split(' ').length
      }
    },

    charactersCount () {
      if (this.selectedNote) {
        // 计算所选笔记的字符数
        return this.selectedNote.content.split('').length
      }
    },
  },

  
  watch: {
    // 笔记改变时保存
    notes: {
      // 方法名
      handler: 'saveNotes',
      // 侦听数组中每个笔记属性的变化
      deep: true,
    },
    // 保存选中项
    selectedId (val, oldVal) {
      localStorage.setItem('selected-id', val)
    },
  },

  methods:{
    // 默认值添加一条笔记
    addNote () {
      const time = Date.now()
      // 新笔记的默认值
      const note = {
        id: String(time),
        title: 'New note ' + (this.notes.length + 1),
        content: '请书写你的笔记吧！',
        created: time,
        favorite: false,
      }
      // 添加到列表中
      this.notes.push(note)
      // Select
      this.selectNote(note)
    },

    // 删除选定的笔记，然后选择下一个
    removeNote () {
      if (this.selectedNote && confirm('确定删除这条笔记吗?')) {
        // 将选中的笔记从列表中移除
        const index = this.notes.indexOf(this.selectedNote)
        if (index !== -1) {
          this.notes.splice(index, 1)
        }
      }
    },

    selectNote (note) {
      // 更新"selectedNote"计算属性
      this.selectedId = note.id
    },

    saveNotes () {
      // 存储笔记
      localStorage.setItem('notes', JSON.stringify(this.notes))
      console.log('Notes saved!', new Date())
    },

    favoriteNote () {
      // this.selectedNote.favorite = !this.selectedNote.favorite
      // this.selectedNote.favorite = this.selectedNote.favorite ^ true
      this.selectedNote.favorite ^= true
    },
  },
})
