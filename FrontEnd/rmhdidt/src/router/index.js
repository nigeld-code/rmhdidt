import Vue from 'vue';
import VueRouter from 'vue-router';

import HomePage from '../components/home/HomePage.vue';
import Display from '../components/display/Display.vue';
import Topic from '../components/topic/Topic.vue';
import Post from '../components/post/Post.vue';
import Content from '../components/postAdmin/Content.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/display/:id', name: 'display', component: Display },
  { path: '/topic/:id', name: 'topic', component: Topic },
  { path: '/post/:id', name: 'post', component: Post },
  { path: '/user/content', name: 'content', component: Content }
];

export default new VueRouter({ mode: 'history', routes });
