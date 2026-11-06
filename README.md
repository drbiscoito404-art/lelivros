# LocalPulse — LeLivros

Biblioteca de demonstração em HTML, CSS e JavaScript, com cadastro/login de usuários e publicação de livros pelo Supabase.

## Preparar o Supabase

1. Crie um projeto no [Supabase](https://supabase.com/) e aguarde o banco ficar disponível.
2. No painel do projeto, abra **SQL Editor**, cole e execute `supabase/migrations/20261105000000_create_books.sql`.
3. Em **Authentication → URL Configuration**, configure o endereço do site publicado como **Site URL** e adicione-o à lista de redirecionamentos permitidos. Para testes locais com Live Server, adicione também `http://127.0.0.1:5500/**`. Os links de confirmação e recuperação de senha retornam para a página usada.
4. No painel, copie a **Project URL** e a chave pública **anon** (ou **publishable**). Nunca use a chave `service_role` no navegador nem neste repositório.
5. Para testar localmente, preencha `supabaseUrl` e `supabaseAnonKey` em `config.js` e sirva a pasta por HTTP, por exemplo com a extensão Live Server. Sem essas configurações, o catálogo de exemplo continua disponível, mas login e publicação ficam desativados.

O banco habilita Row Level Security: qualquer visitante pode ler livros publicados; somente uma sessão autenticada pode publicar e excluir os próprios livros. Senhas são gerenciadas pelo Supabase Auth e não são armazenadas pela aplicação. A publicação torna o livro público imediatamente.

## Publicar no GitHub Pages

1. Crie um repositório GitHub **novo e vazio** para esta pasta e envie somente os arquivos deste projeto.
2. Em **Settings → Secrets and variables → Actions → Variables**, adicione:
   - `SUPABASE_URL`: a Project URL;
   - `SUPABASE_ANON_KEY`: a chave pública anon/publishable.
3. Em **Settings → Pages**, selecione **GitHub Actions** como origem.
4. Envie a branch `main` ou execute manualmente o workflow **Deploy LeLivros** em **Actions**. O workflow gera `config.js` durante o deploy, publica apenas os arquivos do site e exige as duas variáveis para evitar uma publicação que pareça funcionar sem backend.
5. Copie a URL gerada pelo Pages e configure-a no **Site URL** e na lista de redirecionamentos do Supabase. Depois, execute novamente o workflow.

As chaves `anon`/`publishable` são públicas por definição e são protegidas pelas políticas RLS; não coloque a chave `service_role` em variáveis do frontend, arquivos ou Actions.

## Verificações

- Busca, filtros, catálogo de demonstração e leitor funcionam sem conta.
- Cadastro e login exigem uma configuração Supabase válida; confirme o e-mail quando essa opção estiver habilitada no projeto.
- Recuperação de senha e atualização de senha dependem de a URL publicada estar permitida no Supabase.
- Teste a publicação com uma conta, abra o site em uma janela anônima para confirmar que o livro publicado está visível e teste a exclusão na conta autora.
- Não existe contagem real de leituras, upload de arquivos/capas ou moderação de conteúdo nesta primeira versão.
