# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="1-Documentação de Contexto.md"> Documentação de Contexto</a></span>

Esta seção detalha a definição do problema e a proposta de solução sob a ótica dos usuários. O documento abrange o mapeamento de personas, a redação de histórias de usuários, a elicitação de requisitos funcionais e não funcionais, além das restrições tecnológicas. Para a elaboração desta especificação, foram utilizadas técnicas de design thinking para criação de perfis, o método MoSCoW para priorização de requisitos e a modelagem UML para o diagrama de casos de uso

## Personas

**Pedro Paulo:** 26 anos, arquiteto recém-formado e autônomo. Adora viajar e é solteiro. Sente dificuldade em encontrar eventos culturais e opções de lazer em sua cidade de forma centralizada. Busca uma ferramenta que o ajude a descobrir o que fazer no tempo livre sem precisar filtrar dezenas de redes sociais.

**Mariana Costa:** 34 anos, proprietária de um bar com música ao vivo. Precisa divulgar a programação semanal do seu estabelecimento para atrair novos clientes, mas sente que suas postagens em redes sociais comuns possuem alcance limitado pelos algoritmos. Busca uma plataforma onde seu público-alvo já esteja procurando por eventos.

**Lucas Silva:** 21 anos, estudante universitário. Utiliza o celular para organizar toda sua vida social. Valoriza a rapidez e quer encontrar festas e shows próximos à sua localização atual, podendo interagir com o que encontra através de curtidas e comentários.

## Histórias de Usuários

Com base na análise das personas forma identificadas as seguintes histórias de usuários:

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
|Frequentador  | Visualizar eventos em um mapa           | Identificar atividades de lazer próximas à minha localização |
|Frequentador       | Filtrar eventos por categoria (show, teatro, bar) | Encontrar rapidamente experiências que combinem com meu gosto |
| Frequentador  | Curtir e comentar em eventos | Interagir com a comunidade e salvar interesses para consulta |
| Organizador | Cadastrar e editar informações de eventos | Divulgar a agenda do meu estabelecimento de forma estruturada | 
| Organizador | Visualizar o engajamento (curtidas/comentários) | Entender o interesse do público nas atividades propostas |
| Administrador | Moderar comentários e excluir eventos impróprios | Manter a integridade e segurança da plataforma |


## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

<strong>Crie no mínimo 12 Requisitos funcionais, 6 não funcionais e 3 restrições</strong>
<strong>Cada aluno será responsável pela execução completa (back, web e mobile) de pelo menos 2 requisitos que será acompanhado pelo professor</strong>
### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade | Responsável |
|------|-----------------------------------------|----|----|
|RF-001 |Permitir o cadastro e login de usuários (comum e organizador) |ALTA | *A definir* |
| RF-002 | Permitir que organizadores cadastrem eventos com data, hora e local | ALTA |  *A definir* |
| RF-003| Exibir feed de eventos disponíveis com base na data e relevância| ALTA| *A definir*|
| RF-004| Implementar busca de eventos por nome ou categoria| ALTA| *A definir* |
| RF-005| Permitir a edição e exclusão de eventos pelo organizador| ALTA| *A definir*|
| RF-006| Painel de gestão para o estabelecimento gerenciar seu perfil| ALTA| *A definir* |
|RF-007 |Permitir que o usuário curta um evento |MÉDIA |*A definir* |
|RF-008|Permitir a inserção de comentários nas páginas de eventos|MÉDIA|*A definir* |
|RF-009|Implementar visualização de eventos em mapa integrado|MÉDIA|*A definir* |
|RF-010|Disponibilizar filtros por geolocalização (raio de distância)|MÉDIA|*A definir* |
| RF-011| Sistema de recuperação de conta via e-mail| BAIXA| *A definir* |
| RF-012| Implementar sistema de denúncia de eventos ou comentários| BAIXA| *A definir* |

### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O frontend de gestão deve ser responsivo para dispositivos móveis| ALTA|
|RNF-002 |A interface deve ser desenvolvida em Next.js com TypeScript |ALTA |
|RNF-003 |As senhas devem ser armazenadas utilizando criptografia forte (hash) |ALTA |
|RNF-004| O backend deve processar requisições em no máximo 3 segundos| MÉDIA
|RNF-005 |O sistema deve utilizar arquitetura distribuída para suportar escalabilidade |MÉDIA |
|RNF-006 |A aplicação deve garantir 99% de disponibilidade online |BAIXA |


## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
| 01 | O projeto deve utilizar Node.js ou .NET no ecossistema do backend| 
| 02 | O frontend administrativo deve ser restrito ao uso de Next.js e TypeScript |
| 03 | Não poderá ser desenvolvido um módulo de backend que não siga os princípios de sistemas distribuídos |


## Diagrama de Casos de Uso (WiP)

O diagrama de casos de uso é o próximo passo após a elicitação de requisitos, que utiliza um modelo gráfico e uma tabela com as descrições sucintas dos casos de uso e dos atores. Ele contempla a fronteira do sistema e o detalhamento dos requisitos funcionais com a indicação dos atores, casos de uso e seus relacionamentos. 

As referências abaixo irão auxiliá-lo na geração do artefato “Diagrama de Casos de Uso”.

> **Links Úteis**:
> - [Criando Casos de Uso](https://www.ibm.com/docs/pt-br/elm/6.0?topic=requirements-creating-use-cases)
> - [Como Criar Diagrama de Caso de Uso: Tutorial Passo a Passo](https://gitmind.com/pt/fazer-diagrama-de-caso-uso.html/)
> - [Lucidchart](https://www.lucidchart.com/)
> - [Astah](https://astah.net/)
> - [Diagrams](https://app.diagrams.net/)


# Gerenciamento de Projeto (WiP)

De acordo com o PMBoK v6 as dez áreas que constituem os pilares para gerenciar projetos, e que caracterizam a multidisciplinaridade envolvida, são: Integração, Escopo, Cronograma (Tempo), Custos, Qualidade, Recursos, Comunicações, Riscos, Aquisições, Partes Interessadas. Para desenvolver projetos um profissional deve se preocupar em gerenciar todas essas dez áreas. Elas se complementam e se relacionam, de tal forma que não se deve apenas examinar uma área de forma estanque. É preciso considerar, por exemplo, que as áreas de Escopo, Cronograma e Custos estão muito relacionadas. Assim, se eu amplio o escopo de um projeto eu posso afetar seu cronograma e seus custos.

## Gerenciamento de Tempo (WiP)

Com diagramas bem organizados que permitem gerenciar o tempo nos projetos, o gerente de projetos agenda e coordena tarefas dentro de um projeto para estimar o tempo necessário de conclusão.

![Diagrama de rede simplificado notação francesa (método francês)](img/02-diagrama-rede-simplificado.png)

O gráfico de Gantt ou diagrama de Gantt também é uma ferramenta visual utilizada para controlar e gerenciar o cronograma de atividades de um projeto. Com ele, é possível listar tudo que precisa ser feito para colocar o projeto em prática, dividir em atividades e estimar o tempo necessário para executá-las.

![Gráfico de Gantt](img/02-grafico-gantt.png)

## Gerenciamento de Equipe (WiP)

O gerenciamento adequado de tarefas contribuirá para que o projeto alcance altos níveis de produtividade. Por isso, é fundamental que ocorra a gestão de tarefas e de pessoas, de modo que os times envolvidos no projeto possam ser facilmente gerenciados. 

![Simple Project Timeline](img/02-project-timeline.png)

