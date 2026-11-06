# LocalPulse — LeLivros

Biblioteca de demonstração em HTML, CSS e JavaScript, com cadastro/login de usuários e publicação de livros pelo Supabase.

## Preparar o Supabase

1. Crie um projeto no [Supabase](https://supabase.com/) e aguarde o banco ficar disponível.
2. No painel do projeto, abra **SQL Editor** e execute, nesta ordem, as migrações `supabase/migrations/20261105000000_create_books.sql` e `supabase/migrations/20261106000000_add_book_file_storage.sql`. A segunda cria o bucket público dos livros e as políticas de acesso.
3. Em **Authentication → URL Configuration**, configure o endereço do site publicado como **Site URL** e adicione-o à lista de redirecionamentos permitidos. Para testes locais com Live Server, adicione também `http://127.0.0.1:5500/**`. Os links de confirmação e recuperação de senha retornam para a página usada.
4. No painel, copie a **Project URL** e a chave pública **anon** (ou **publishable**). Nunca use a chave `service_role` no navegador nem neste repositório.
5. Para testar localmente, preencha `supabaseUrl` e `supabaseAnonKey` em `config.js` e sirva a pasta por HTTP, por exemplo com a extensão Live Server. Sem essas configurações, o catálogo de exemplo continua disponível, mas login e publicação ficam desativados.

O banco habilita Row Level Security: qualquer visitante pode ler livros e arquivos publicados; somente uma sessão autenticada pode publicar e excluir os próprios livros e arquivos. Senhas são gerenciadas pelo Supabase Auth e não são armazenadas pela aplicação. A publicação torna o livro e os arquivos públicos imediatamente.

## Arquivos de livros e capas

- Livros aceitos: PDF, EPUB, TXT, Markdown (MD) e DOCX, com até 20 MB antes e depois da conversão.
- TXT, MD e DOCX são convertidos no navegador para EPUB. A conversão de DOCX preserva texto e formatação básica; elementos incompatíveis podem ser simplificados.
- PDFs são regravados sem rasterizar as páginas para tentar reduzir o tamanho; se a versão otimizada não ficar menor, o original é mantido e isso é informado. PDFs de páginas escaneadas podem reduzir pouco, pois as imagens não são degradadas automaticamente. Arquivos inválidos ou protegidos por senha são rejeitados. EPUBs válidos são recompactados sem perda, mantendo o original quando ele já é menor.
- Capas PNG, JPG e WebP são redimensionadas e convertidas para WebP quando a conversão economiza espaço. Uma imagem original menor é mantida. A entrada aceita até 12 MB e a imagem final deve ter até 4 MB.
- A leitura de PDFs é feita no navegador; EPUBs usam um leitor no site. Para permitir essas funções, o navegador carrega bibliotecas de conversão e leitura do jsDelivr.
- Não são aceitos formatos de livro diferentes dos listados; conversão confiável de qualquer formato não é possível no navegador.

## Publicar no GitHub Pages

1. Crie um repositório GitHub **novo e vazio** para esta pasta e envie somente os arquivos deste projeto.
2. Opcionalmente, em **Settings → Secrets and variables → Actions → Variables**, adicione:
   - `SUPABASE_URL`: a Project URL;
   - `SUPABASE_ANON_KEY`: a chave pública anon/publishable.
   Quando definidas, ambas as variáveis devem estar presentes e substituem a configuração do `config.js`. Sem essas variáveis, o workflow usa o `config.js` versionado.
3. Em **Settings → Pages**, selecione **GitHub Actions** como origem.
4. Envie a branch `main` ou execute manualmente o workflow **Deploy LeLivros** em **Actions**. O workflow publica apenas os arquivos do site e usa as variáveis de Actions, se configuradas, ou a configuração pública do `config.js`.
5. Copie a URL gerada pelo Pages e configure-a no **Site URL** e na lista de redirecionamentos do Supabase. Depois, execute novamente o workflow.

As chaves `anon`/`publishable` são públicas por definição e são protegidas pelas políticas RLS; não coloque a chave `service_role` em variáveis do frontend, arquivos ou Actions.

## Verificações

- Busca, filtros, catálogo de demonstração e leitor funcionam sem conta.
- Cadastro e login exigem uma configuração Supabase válida; confirme o e-mail quando essa opção estiver habilitada no projeto.
- Recuperação de senha e atualização de senha dependem de a URL publicada estar permitida no Supabase.
- Teste a publicação com uma conta, abra o site em uma janela anônima para confirmar que o livro publicado está visível e teste a exclusão na conta autora.
- Não existe contagem real de leituras nem moderação de conteúdo nesta versão.
