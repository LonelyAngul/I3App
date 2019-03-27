import {NativeTransitionOptions} from "@ionic-native/native-page-transitions";

export const pushOption: NativeTransitionOptions = {
  direction: 'left',// 'left|right|up|down', default 'left' (which is like 'next')
  duration: 300,
  slowdownfactor: 10,
  slidePixels: 20,
  iosdelay: 100,
  androiddelay: 1,
  fixedPixelsTop: 0,
  fixedPixelsBottom: 0
}
//export const popOption: NativeTransitionOptions = Object.assign({direction: 'right'}, pushOption)
export const popOption: NativeTransitionOptions = {
  direction: 'right',// 'left|right|up|down', default 'left' (which is like 'next')
  duration: 100,
  slowdownfactor: 3,
  slidePixels: 20,
  iosdelay: 100,
  androiddelay: 50,
  fixedPixelsTop: 0,
  fixedPixelsBottom: 0
}
