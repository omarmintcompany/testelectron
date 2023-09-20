import { WhsInfo } from '../interfaces/WhsInfo';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useWhsStore = defineStore('whs', {
  state: () => ({
    options: {
      ApiEndPoint: 'http://localhost:32769',
      WhsData: { whsCode: '', whsName: '', isDefault: false } as WhsInfo,
      WhsList: [] as WhsInfo[],
    },
  }),
  actions: {
    setWhsList() {
      axios
        .get(`${this.options['ApiEndPoint']}/whsipmapping/`)
        .then((x) => {
          this.options['WhsList'] = x.data as WhsInfo[];
          this.options['WhsData'] = this.options['WhsList'].filter((item) => {
            return item.isDefault == true;
          })[0];
        })
        .catch((err) => console.log('Axios err: ', err));
    },
    setWhsCode(value: WhsInfor) {
      this.options['WhsData'] = value;
    },
  },
  getters: {
    getCurrentWhsCode(): string {
      return this.options['WhsData'];
    },
    getWhsList(): WhsInfo[] {
      return this.options['WhsList'];
    },
  },
});
