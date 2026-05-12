import React from "react";
import { View} from "react-native";
import { Button, EButtonTypes } from "./components/button";

const App = () => {

  /**
   *  Lógicas de ação costumam situar-se nos arquivos de maior hierarquia (tela)
   * devido à necessidade, muitas vezes, de interação entre diversos tipos de dados.
   * É preciso avaliar caso a caso, mas lembre-se de manter componentes o mais
   * agnósticos possível.
   */
  const handleButtonPress = () => {
    console.log("E não é que tu clicou mesmo! =O")
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#ff8888',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    }}>
      {/* Exemplo de uso do botão, passando apenas os dados que realmente são necessários */}
      <Button
        onPress={handleButtonPress} // lógica de ação
        label="Olha esse Botão"
        type={EButtonTypes.PRIMARY}
      />
    </View>
  )
}

export default App;
