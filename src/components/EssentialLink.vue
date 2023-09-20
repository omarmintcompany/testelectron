<template>
  <div>
    <div v-if="children.length == 0">
      <q-item clickable v-ripple :inset-level="level" :to="link">
        <q-item-section>{{ title }}</q-item-section>
      </q-item>
    </div>
    <div v-else>
      <div v-if="children.length > 0">
        <!-- {{children}} -->
        <q-expansion-item
          expand-separator
          :icon="icon"
          :label="title"
          :caption="caption"
          :header-inset-level="level"
          default-closed
        >
          <EssentialLink v-for="child in children" :key="child" v-bind="child">
          </EssentialLink>
        </q-expansion-item>
      </div>
      <div v-else>
        <q-item clickable v-ripple :inset-level="level" :to="link">
          <q-item-section>{{ title }}</q-item-section>
        </q-item>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    link: {
      type: String,
      default: '#',
    },

    icon: {
      type: String,
      default: '',
    },

    level: {
      type: String,
      default: '',
    },
    children: [],
  },
});
</script>
