/**
 * Este arquivo tem a função apenas de juntar no mesmo lugar todos os exports 
 * que são necessários. Não é mandatório mas ele deixa mais elegante a utilização
 * 
 * Sem esse arquivo, quando precisássemos usar o botão, teríamos algo como:
 * import {Button} from "./caminho/ate/a-pasta/button/button.container"
 * import {TButtonProps} from "./caminho/ate/a-pasta/button/types"
 * 
 * Com ele, podemos reduzir para um único import:
 * import { Button, EButtonTypes } from "./caminho/ate/a-pasta/button";
 */
export {Button} from './button.container';
export {EButtonTypes, TButtonProps} from './types'