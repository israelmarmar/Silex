import { SITE1, mockUiElements } from '../../../__tests__/data-set';
const iframe = mockUiElements()

import { initializeSite_, initializeSite } from './store'
import { onChangeSite } from './observer'
import { createStore } from 'redux'
import { Store } from 'redux'
import { ProdotypeCompDef } from '../externs'
import { ProdotypeDependency } from '../element/types'
import { State } from '../flux/types'

// fake prodotype
class Prodotype {
  constructor(element: HTMLElement, folder: string) {
    // console.log('[Prodotype] constructor', {folder})
  }
  componentsDef: ProdotypeCompDef = {
    text: '',
  }
  decorate(templateName: string, data: any, dataSources?: object): Promise<string> {
    // console.log('[Prodotype] decorate', {templateName, data})
    return Promise.resolve('fake prodotype rendered component or style')
  }
  ready(cbk: (any) => void) {
    // console.log('[Prodotype] ready', {cbk})
  }
  edit(
    data?: any,
    dataSources?: object,
    templateName?: string,
    events?: any) {}
  reset() {}
  createName(type, list): string { return 'New fake name' }
  getDependencies(components: {name:string, displayName?:string, templateName:string}[]): {[key: string]: ProdotypeDependency[]} {
    return {}
  }
  getMissingDependencies(
    container: HTMLElement,
    componentNames: {templateName: string}[],
  ): HTMLElement[] {
    return []
  }
  getUnusedDependencies(dependencyElements: HTMLElement[], componentNames: {templateName: string}[]) {
    return []
  }
}
// tslint:disable:no-string-literal
window['Prodotype'] = Prodotype

const store: Store<State> = createStore((oldState, newState) => {
  // console.log('store', oldState, newState)
})

const dependenciesString = `
  <script data-dependency="" src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <link data-dependency="" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/unslider/2.0.3/css/unslider.css">
`
const styleString = `
  <style class="silex-prodotype-style" type="text/css" data-style-id="all-style">.text-element > .silex-element-content {font-family: 'Roboto', sans-serif;}</style>
`

beforeEach(() => {
  iframe.contentDocument.write('<html />')
  initializeSite_(store, SITE1)
})

// //////////////////////////
// dependencies

test('add prodotype dependencies', () => {
  expect(iframe.contentDocument.head.querySelectorAll('[data-dependency]')).toHaveLength(0)
  onChangeSite(null, SITE1)
  expect(iframe.contentDocument.head.querySelectorAll('[data-dependency]')).toHaveLength(2)
})

test('add 0 prodotype dependencies', () => {
  // has 0 dependency and update with 0
  onChangeSite(null, {
    ...SITE1,
    prodotypeDependencies: {},
  })
  expect(iframe.contentDocument.head.querySelectorAll('[data-dependency]')).toHaveLength(0)

  // already has all dependencies
  iframe.contentDocument.head.innerHTML = dependenciesString
  expect(iframe.contentDocument.head.querySelectorAll('[data-dependency]')).toHaveLength(2)
  onChangeSite(null, SITE1)
  expect(iframe.contentDocument.head.querySelectorAll('[data-dependency]')).toHaveLength(2)
})

test('remove 2 prodotype dependencies', () => {
  iframe.contentDocument.head.innerHTML = dependenciesString
  expect(iframe.contentDocument.head.querySelectorAll('[data-dependency]')).toHaveLength(2)
  onChangeSite(null, {
    ...SITE1,
    prodotypeDependencies: {},
  })
  expect(iframe.contentDocument.head.querySelectorAll('[data-dependency]')).toHaveLength(0)
})

// //////////////////////////
// styles

test('add a style', () => {
  expect(iframe.contentDocument.head.querySelectorAll('[data-style-id]')).toHaveLength(0)
  onChangeSite(null, SITE1)
  expect(iframe.contentDocument.head.querySelectorAll('[data-style-id]')).toHaveLength(1)
})

test('add 0 styles', () => {
  // there was no styles and there will be no styles
  expect(iframe.contentDocument.head.querySelectorAll('[data-style-id]')).toHaveLength(0)
  onChangeSite(null, {
    ...SITE1,
    styles: {},
  })
  expect(iframe.contentDocument.head.querySelectorAll('[data-style-id]')).toHaveLength(0)
  // already has the styles
  iframe.contentDocument.head.innerHTML = styleString
  expect(iframe.contentDocument.head.querySelectorAll('[data-style-id]')).toHaveLength(1)
  onChangeSite(null, SITE1)
  expect(iframe.contentDocument.head.querySelectorAll('[data-style-id]')).toHaveLength(1)
})


test('remove style', () => {
  iframe.contentDocument.head.innerHTML = styleString
  expect(iframe.contentDocument.head.querySelectorAll('[data-style-id]')).toHaveLength(1)
  onChangeSite(null, {
    ...SITE1,
    styles: {},
  })
  expect(iframe.contentDocument.head.querySelectorAll('[data-style-id]')).toHaveLength(0)
})
