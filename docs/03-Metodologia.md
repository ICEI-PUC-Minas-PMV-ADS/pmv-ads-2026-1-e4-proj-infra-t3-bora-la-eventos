
# Metodologia

<span style="color:red">Pré-requisitos: <a href="2-Especificação do Projeto.md"> Documentação de Especificação</a></span>

Está descrito aqui a metodologia de trabalho do grupo para atacar o problema. Definições sobre os ambientes de trabalho utilizados pela equipe para desenvolver o projeto. Abrange a relação de ambientes utilizados, a estrutura para gestão do código fonte, além da definição do processo e ferramentas através dos quais a equipe se organiza.

## Relação de Ambientes de Trabalho

| Ambiente | Plataforma | Link de Acesso |
|---|---|---|
| Repositório de código fonte | GitHub | [github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-bora-la-eventos](https://github.com/ICEI-PUC-Minas-PMV-ADS/pmv-ads-2026-1-e4-proj-infra-t3-bora-la-eventos) |
| Gerenciamento do projeto | GitHub Projects | Disponível no repositório |
| Comunicação da equipe | WhatsApp / Discord | — |
| Editor de código | Visual Studio Code | [code.visualstudio.com](https://code.visualstudio.com) |
| IDE Backend | Visual Studio / Rider | — |
| Banco de Dados | MongoDB Atlas | [mongodb.com/atlas](https://www.mongodb.com/atlas) |
| Design e Wireframes | Figma | [figma.com](https://www.figma.com) |
| Diagramas | draw.io (diagrams.net) | [diagrams.net](https://www.diagrams.net) |

### Ambientes de Desenvolvimento

**Backend:**
O backend é desenvolvido em C# com .NET, utilizando o Visual Studio ou Visual Studio Code como editor. O banco de dados utilizado é o MongoDB, acessado via MongoDB Driver para .NET.

**Frontend Web:**
A aplicação web administrativa é desenvolvida em Next.js com TypeScript, utilizando o Visual Studio Code como editor principal.

**Mobile:**
O aplicativo mobile é desenvolvido em React Native, também com Visual Studio Code como editor principal.

### Ambiente de Testes

Os testes são realizados localmente em cada máquina dos desenvolvedores. O mobile é testado via emuladores Android/iOS e dispositivos físicos.

### Ambiente de Produção

A definição do ambiente de produção será realizada ao longo do projeto, com possibilidade de uso de serviços de nuvem compatíveis com .NET e MongoDB.

## Controle de Versão

A ferramenta de controle de versão adotada no projeto foi o [Git](https://git-scm.com/), sendo que o [GitHub](https://github.com) foi utilizado para hospedagem do repositório.

### Estrutura de Branches

| Branch | Descrição |
|---|---|
| `main` | Versão estável já testada do software |
| `develop` | Branch principal de desenvolvimento; base para features e fixes |
| `feat/[nome-da-issue]` | Desenvolvimento de novas funcionalidades, criada a partir de `develop` |
| `fix/[nome-da-issue]` | Correção de erros, criada a partir de `develop` |

O fluxo segue o seguinte padrão: branches de feature e fix são criadas a partir de `develop`, e após conclusão são mescladas de volta em `develop` via Pull Request. Periodicamente, `develop` é mesclada em `main` após validação.

### Gerenciamento de Issues

**Tipos de issue:**
- `bug`: problema em uma funcionalidade existente
- `feature`: nova funcionalidade a ser introduzida
- `task`: tarefa geral, como configuração de ambiente ou organização de arquivos
- `documentation`: melhorias ou acréscimos à documentação

**Categorias de atividades:**
- **Arquitetura**: modelagem do sistema, diagramas e estrutura da aplicação
- **Desenvolvimento**: implementação de código e integração
- **Documentação**: atualização de documentos no GitHub
- **Gestão de Projeto**: organização de sprints, reuniões e acompanhamento
- **Qualidade**: testes de software e validação antes da entrega
- **UX/UI**: atividades voltadas para design e experiência do usuário

## Gerenciamento de Projeto

### Divisão de Papéis

A equipe utiliza metodologias ágeis, tendo escolhido o **Scrum** como base para definição do processo de desenvolvimento. A equipe está organizada da seguinte maneira:

- **Scrum Master:** Michelle Lourenço Mendonça
- **Product Owner:** Willy Christian de Oliveira Teixeira
- **Equipe de Desenvolvimento:** Michelle Lourenço Mendonça e Samuel Ribeiro
- **Equipe de Design:** Gustavo Viana e Miréia Torres Lima

### Processo

O processo Scrum é organizado em 5 sprints, cada uma com objetivo e entregas definidos:

**Sprint 1 — Concepção e Proposta de Solução**
- Objetivo: Definir o problema e desenvolver a proposta de solução.
- Tarefas: Documentação de Contexto, Especificação do Projeto, vídeo de apresentação.
- Duração: 25 dias.

**Sprint 2 — Projeto da Solução e Início do Desenvolvimento**
- Objetivo: Projetar a solução tecnológica e planejar os testes.
- Tarefas: Metodologia, Projeto de Interface, Arquitetura da Solução, Plano de Testes de Software e Usabilidade.
- Duração: 28 dias.

**Sprint 3 — Desenvolvimento da Solução (Parte 1)**
- Objetivo: Implementar as funcionalidades base e críticas.
- Tarefas: Template padrão da aplicação, funcionalidades fase 1, Registro de Testes.
- Duração: 35 dias.

**Sprint 4 — Desenvolvimento da Solução (Parte 2)**
- Objetivo: Implementar as funcionalidades restantes.
- Tarefas: Funcionalidades fase 2, atualização dos Registros de Testes.
- Duração: 28 dias.

**Sprint 5 — Diagnóstico, Entrega e Apresentação**
- Objetivo: Finalizar relatórios e entregar a versão final da solução.
- Tarefas: Relatórios finais de testes, apresentação, vídeo de demonstração, referências.
- Duração: 14 dias.

O acompanhamento das tarefas é feito pelo **GitHub Projects**, onde as issues são organizadas em colunas (Backlog, In Progress, Done).

**Daily Scrum:** realizado via aplicativos de mensagens (WhatsApp/Discord). Quando necessário, reuniões em formato de call são agendadas conforme disponibilidade dos membros.

**Sprint Review:** ocorre durante a semana de entrega, com revisão dos itens da sprint e alinhamento com a professora orientadora. Após o feedback, são realizadas as correções necessárias.

**Sprint Retrospective:** realizada após a entrega, com reflexão sobre melhorias no processo para a sprint seguinte.

### Product Backlog

| Prioridade | Item |
|---|---|
| 1 | Documentação de Contexto |
| 2 | Especificação do Projeto |
| 3 | Metodologia |
| 4 | Projeto de Interface |
| 5 | Arquitetura da Solução |
| 6 | Template Padrão da Aplicação |
| 7 | Programação de Funcionalidades |
| 8 | Plano de Testes de Software |
| 9 | Registro de Testes de Software |
| 10 | Plano de Testes de Usabilidade |
| 11 | Registro de Testes de Usabilidade |
| 12 | Apresentação do Projeto |
| 13 | Referências |

Os itens foram priorizados com base nas datas de entrega e dependências entre artefatos.

### Ferramentas

| Ferramenta | Finalidade |
|---|---|
| Visual Studio Code | Editor principal para backend (C#), frontend web (Next.js) e mobile (React Native) |
| .NET 9.0 | Framework do backend |
| Next.js + TypeScript | Framework da aplicação web |
| React Native | Framework do aplicativo mobile |
| MongoDB Atlas | Banco de dados NoSQL em nuvem |
| Git + GitHub | Controle de versão e hospedagem do repositório |
| GitHub Projects | Gerenciamento de tarefas e sprints |
| WhatsApp / Discord | Comunicação entre os membros da equipe |
| Figma | Criação de wireframes e protótipos de interface |
| draw.io | Criação de diagramas de arquitetura e fluxos |

**Justificativa das escolhas:**
O Visual Studio Code foi escolhido por sua versatilidade — suporta tanto C# (com extensão C# Dev Kit) quanto JavaScript/TypeScript, centralizando o ambiente de desenvolvimento da equipe. O MongoDB foi escolhido por sua flexibilidade de esquema, adequada ao modelo de dados do projeto (eventos, usuários, pedidos). O GitHub Projects foi adotado por já estar integrado ao repositório, evitando ferramentas externas. Figma e draw.io foram selecionados por permitirem colaboração em tempo real no design e nos diagramas.
