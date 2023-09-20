<template>
  <div></div>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        >
        </EssentialLink>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

const linksList = [
  {
    title: 'Search',
    caption: 'quasar.dev',
    icon: 'book_online',
    link: 'https://quasar.dev',
    level: 0,
    children: [
      {
        title: 'Documents',
        caption: 'quasar.dev',
        icon: 'school',
        link: 'https://quasar.dev',
        level: 1,
        children: [
          {
            title: 'Search (level 3)',
            caption: 'quasar.dev',
            icon: 'school',
            link: 'https://quasar.dev',
            level: 2,
            children: [],
          },
        ],
      },
    ],
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
    level: 0,
    children: [
      {
        title: 'Github Level 2',
        caption: 'quasar.dev',
        icon: 'school',
        link: 'https://quasar.dev',
        level: 1,
        children: [],
      },
    ],
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'school',
    link: 'prueba',
    level: 0,
    children: [],
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
