import { WhsInfo } from '../interfaces/WhsInfo';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useWhsStore = defineStore('whs', {
  state: () => ({
    options: {
      ApiEndPoint: 'http://localhost:32771',
      WhsData: { whsCode: '', whsName: '', isDefault: false } as WhsInfo,
      WhsList: [] as WhsInfo[],
      token: 's' as string,
    },
  }),
  actions: {
    setWhsList() {
      axios
        .get(`${this.options['ApiEndPoint']}/whsipmapping/`)
        .then((x) => {
          this.options['token'] = '';
          this.options['WhsList'] = x.data as WhsInfo[];
          this.options['WhsData'] = this.options['WhsList'].filter((item) => {
            return item.isDefault == true;
          })[0];
        })
        .catch((err) => console.log('Axios err: ', err));
    },
    setWhsCode(value: WhsInfo) {
      this.options['WhsData'] = value;
    },
    setToken(value: string) {
      this.options['token'] = value;
    },
  },
  getters: {
    getCurrentWhsCode(): WhsInfo {
      return this.options['WhsData'];
    },
    getWhsList(): WhsInfo[] {
      return this.options['WhsList'];
    },
    getToken(): string {
      return this.options['token'];
    },
  },
});
