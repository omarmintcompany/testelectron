import { WhsInfo } from '../interfaces/WhsInfo';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useWhsStore = defineStore('whs', {
  state: () => ({
    options: {
      ApiEndPoint: 'http://localhost:32769',
      WhsData: { whsCode: '', whsName: '', isDefault: false } as WhsInfo,
      WhsList: [] as WhsInfo[],
      token: '' as string,
      lastError: '' as string,
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
          //  this.hideLoading();
        })
        .catch((err) => console.log('Axios err: ', err));
    },
    setWhsCode(value: WhsInfo) {
      this.options['WhsData'] = value;
    },
    setToken(value: string) {
      this.options['token'] = value;
    },
    setLastError(value: string) {
      this.options['lastError'] = value;
    },
  },
  getters: {
    getLastError(): string {
      return this.options['lastError'];
    },
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
