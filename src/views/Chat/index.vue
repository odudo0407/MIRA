<!-- src/views/Chat/index.vue -->
<template>
  <div class="chat">
    <NavBar />
    
    <div class="chat-container">
      <!-- 左侧会话列表 -->
      <ConversationList 
        :conversations="conversations"
        :current-id="currentConversationId"
        @select="selectConversation"
        @new="newConversation"
        @delete="deleteConversation"
      />
      
      <!-- 右侧聊天区域 -->
      <div class="chat-main">
        <!-- 消息列表 -->
        <MessageList 
          :messages="currentMessages"
          :loading="loading && loadingConversationId === currentConversationId"
        />
        
        <!-- 输入区域 -->
        <InputArea 
          @send="sendMessage"
          :disabled="!currentConversationId"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavBar from '@/views/Home/components/NavBar.vue'
import ConversationList from './components/ConversationList.vue'
import MessageList from './components/MessageList.vue'
import InputArea from './components/InputArea.vue'

// 会话列表
const conversations = ref([
  { 
    id: 1, 
    title: 'Vue3响应式原理', 
    lastMessage: 'Proxy和Reflect的区别是什么？',
    time: '2小时前',
    unread: 0
  },
  { 
    id: 2, 
    title: '面经求助', 
    lastMessage: '字节跳动面试经验',
    time: '昨天',
    unread: 3
  },
  { 
    id: 3, 
    title: '算法题讨论', 
    lastMessage: '二叉树遍历',
    time: '2024-03-01',
    unread: 0
  }
])

// 当前选中的会话ID
const currentConversationId = ref(1)

// 正在加载的会话ID（用于区分是哪个会话在回复）
const loadingConversationId = ref(null)

// 消息列表（按会话ID存储）
const messagesMap = ref({
  1: [
    { id: 1, role: 'user', content: 'Vue3的响应式原理是什么？', time: '10:30' },
    { id: 2, role: 'assistant', content: 'Vue3使用Proxy对象来实现响应式系统。相比Vue2的Object.defineProperty，Proxy可以监听整个对象的变化，包括属性的添加和删除，性能也更好。', time: '10:31' },
    { id: 3, role: 'user', content: '那Reflect是做什么的？', time: '10:32' },
    { id: 4, role: 'assistant', content: 'Reflect是一个内置对象，提供拦截JavaScript操作的方法。在Vue3中，Reflect与Proxy配合使用，确保默认行为能够正常进行，比如触发数组的更新等。', time: '10:33' }
  ],
  2: [
    { id: 1, role: 'user', content: '字节跳动面试都问什么？', time: '昨天 14:20' },
    { id: 2, role: 'assistant', content: '主要考察：Vue/React框架原理、JavaScript基础、算法题、项目经验。需要我详细说说吗？', time: '昨天 14:21' }
  ],
  3: [
    { id: 1, role: 'user', content: '二叉树的前序遍历怎么写？', time: '2024-03-01 09:15' },
    { id: 2, role: 'assistant', content: '递归写法：先访问根节点，再遍历左子树，最后右子树。需要代码示例吗？', time: '2024-03-01 09:16' }
  ]
})

// 当前会话的消息
const currentMessages = computed(() => {
  return messagesMap.value[currentConversationId.value] || []
})

// 切换会话
const selectConversation = (id) => {
  // 找到当前要选中的会话
  const targetConv = conversations.value.find(c => c.id === id)
  if (targetConv) {
    targetConv.unread = 0
  }
  
  // 切换当前会话
  currentConversationId.value = id
}

// 新建会话
const newConversation = () => {
  const newId = Date.now()
  conversations.value.unshift({
    id: newId,
    title: '新对话',
    lastMessage: '',
    time: '刚刚',
    unread: 0
  })
  
  messagesMap.value[newId] = []
  currentConversationId.value = newId
}

// 删除会话
const deleteConversation = (id) => {
  // 从会话列表中删除
  const index = conversations.value.findIndex(c => c.id === id)
  if (index !== -1) {
    conversations.value.splice(index, 1)
  }
  
  // 删除对应的消息
  delete messagesMap.value[id]
  
  // 如果删除的是当前选中的会话，自动选中第一个会话
  if (currentConversationId.value === id) {
    currentConversationId.value = conversations.value[0]?.id || null
  }
  
  // 如果删除的是正在加载的会话，清除加载状态
  if (loadingConversationId.value === id) {
    loadingConversationId.value = null
  }
}

// 发送消息
const sendMessage = async (content) => {
  if (!content.trim() || !currentConversationId.value) return
  
  const conversationId = currentConversationId.value // 保存当前会话ID
  
  // 用户消息
  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: content,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  messagesMap.value[conversationId].push(userMessage)
  
  // 更新会话列表的最后一条消息
  const conversation = conversations.value.find(c => c.id === conversationId)
  if (conversation) {
    conversation.lastMessage = content
    conversation.time = '刚刚'
  }
  
  // 模拟AI回复 - 设置加载状态为当前会话
  loadingConversationId.value = conversationId
  
  setTimeout(() => {
    // 检查：如果当前会话还是原来的，才添加回复
    // 但无论是否切换，这条回复都应该属于原来的会话
    const aiMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: getAIResponse(content),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    
    // 确保消息添加到正确的会话（conversationId）
    if (messagesMap.value[conversationId]) {
      messagesMap.value[conversationId].push(aiMessage)
      
      // 更新该会话的最后一条消息
      const targetConv = conversations.value.find(c => c.id === conversationId)
      if (targetConv) {
        targetConv.lastMessage = aiMessage.content
      }
      
      // 如果当前选中的不是这个会话，给这个会话增加未读消息
      if (currentConversationId.value !== conversationId) {
        const targetConv = conversations.value.find(c => c.id === conversationId)
        if (targetConv) {
          targetConv.unread = (targetConv.unread || 0) + 1
        }
      }
    }
    
    // 清除加载状态
    loadingConversationId.value = null
  }, 1000)
}

// 模拟AI回复
const getAIResponse = (question) => {
  const responses = [
    '这个问题很有意思！让我想想...',
    '根据我的理解，应该是这样的...',
    '你可以参考一下这个思路...',
    '我建议你先了解基础概念...',
    '这个问题在面试中经常出现，重点是要理解原理...'
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}
</script>

<style lang="scss" scoped>
@import '@/styles/var.scss';

.chat {
  background: $bg-body;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  // 隐藏所有滚动条
  ::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.chat-container {
  width: $container-width;
  margin: 20px auto;
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
  height: calc(100vh - 100px);
  
  // 子组件也继承隐藏滚动条
  ::-webkit-scrollbar {
    display: none;
  }
}

.chat-main {
  flex: 1;
  background: $white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}
</style>