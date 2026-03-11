## Backend - Serviço de Eventos

### Executando o projeto

1. Após clonar o projeto, abra o terminal (powershell, por exemplo) e navegue até a pasta `backend`
```powershell
PS C:\caminho\para\projeto> cd .\src\backend\
```

2. Use o comando de abertura do Visual Studio* para abrir o arquivo .sln. Alternativamente, é possível usar o clique duplo no arquivo, acessando pelo explorador de arquivos.
```powershell
PS C:\caminho\para\projeto\src\backend> devenv eventos_csharp.sln
```
<small>\* Verifique antes se o atalho do executável foi adicionado ao PATH do sistema. caso não tenha sido, va para [essa seção](#adicionando-o-visual-studio-no-path)</small>

3. Com o Visual Studio aberto, na barra de ferramentas acima do editor, selecione a opção `http` no dropdown.

### Adicionando novos serviços ao projeto

- Abra o terminal (powershell, por exemplo) e navegue até a pasta do projeto
```powershell
PS C:\caminho\do\usario> cd .\caminho\para\o\projeto\src\backend\
```
Alternativamente, se estiver com o projeto aberto no visual studio, basta abrir o menu _Exibir_ e clicar em _Terminal_

- Estando na pasta do projeto, utilize o comando abaixo para criar um novo serviço
```powershell
PS C:\caminho\para\projeto\src\backend> dotnet new webapi -n NomeDoSeuService 
```
- Após criado o novo projeto, adicione-o ao gerenciador que fica na raíz da pasta `backend`, com o comando:
```powershell
PS C:\caminho\para\projeto\src\backend> dotnet sln add NomeDoSeuService/NomeDoSeuService.csproj
```
<mark style="background-color: #f7250d; color: #fff; padding: 2px 5px;">IMPORTANTE</mark>: Lembre-se de rodar esse comando na raíz da pasta backend sempre que criar um novo serviço, pois senão ele não ficará visível na IDE e, se preciso, no compartilhamento de recursos  

### Adicionando o atalho do Visual Studio no PATH 

- Clique no menu iniciar do Windows ou aperte a tecla windows no teclado;
- Na barra de pesquisa procure por `"variáveis de ambiente"` (se os sistema estiver em ingles, busque por `environment vars`);
- A primeira opção, logo abaixo do título **Melhores Resultados** costuma ser a opção correta. Ela esta nomeada como _Editar variáveis de ambiente do sistema_ (ou em ingles, _Edit System Environment Variables_);
- Encontre o botão com o título **Variáveis de Ambiente** e clique nele
- Uma nova janela se abrirá, contendo 2 elementos sendo o primeiro, na parte de cima, as variáveis do usuário logado e a inferior do sistema todo. No primeiro quadro, de cima para baixo, role até encontrar **Path** e clique em editar, abaixo do mesmo quadro
- Aparecerá uma lista contendo vários caminhos do sistema. Se não encontrar o caminho abaixo, clique em _novo_ e adicione o caminho abaixo:

`C:\Program Files\Microsoft Visual Studio\2022\[Versão]\Common7\IDE\`

A versão vai depender da que esta instalada na tua máquina, podendo ser: 
1. `Community`
2. `Professional`
3. `Enterprise` 

Subistitua o nome da versão no caminho fornecido. Exemplo:  `C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\` e depois salve.

Caso um caminho ja exista mas esteja diferente, clique sobre o caminho existente e aperte o botão editar, corrigindo conforme o exemplo dado e salve. 

Para que a mudança surta efeito é bom reiniciar o terminal, caso ainda esteja aberto
