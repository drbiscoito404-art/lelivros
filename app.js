const sampleBooks = [
 {id:"s1",title:"O peso do tempo",author:"Marina Costa",genre:"Romance",reads:980,featured:true,cover:1,description:"Em uma cidade que parece ter parado no tempo, duas pessoas descobrem que algumas escolhas continuam ecoando muito depois de serem feitas.",content:"Capítulo 1 — O relógio da praça\n\nA cidade acordava sempre do mesmo jeito. Às sete, o sino da igreja cortava o silêncio, as portas se abriam e o cheiro de café escapava pelas janelas. Para Clara, porém, aquela manhã tinha algo diferente.\n\nSobre a mesa havia uma carta sem remetente. O papel amarelado guardava apenas uma frase: algumas histórias não terminam quando alguém vai embora.\n\nEla reconheceu a letra imediatamente. Fazia dez anos que não a via, mas certas lembranças não precisavam de convite para voltar.\n\nClara respirou fundo, pegou o casaco e saiu. Pela primeira vez em muito tempo, não sabia o que encontraria — e isso parecia uma boa razão para continuar."},
 {id:"s2",title:"A última órbita",author:"Rafael Nunes",genre:"Ficção científica",reads:870,featured:true,cover:7,description:"Quando o último sinal humano chega de uma estação distante, uma equipe precisa decidir se responde ao chamado.",content:"Capítulo 1 — Sinal\n\nO sinal apareceu às 03h17, no exato momento em que a estação atravessava a sombra de Júpiter. Não era ruído, nem interferência. Eram três pulsos, uma pausa e mais três pulsos.\n\nA comandante Lia observou a tela por longos segundos. A origem estava além da rota conhecida, numa região onde nenhum equipamento deveria estar transmitindo.\n\n— Repita a leitura — pediu.\n\nO operador não respondeu. Apenas apontou para a segunda linha do relatório. O sinal continha coordenadas. E as coordenadas apontavam para casa."},
 {id:"s3",title:"O jardim das sombras",author:"Helena Prado",genre:"Mistério",reads:760,featured:true,cover:3,description:"Uma antiga propriedade esconde pistas que ligam o desaparecimento de uma família a um segredo enterrado há décadas.",content:"Capítulo 1 — A casa vazia\n\nA chave estava debaixo do vaso, exatamente como dizia o bilhete. Elisa hesitou antes de girá-la. A casa parecia observar a rua por suas janelas escuras.\n\nPor dentro, tudo estava coberto por uma camada fina de poeira, menos o corredor. Havia marcas recentes no assoalho, passos que iam até a porta do jardim e não voltavam.\n\nNo centro da sala, sobre uma mesa de madeira, repousava uma fotografia virada para baixo. Elisa a ergueu devagar. No verso, alguém escrevera seu nome."},
 {id:"s4",title:"Entre linhas",author:"Lucas Almeida",genre:"Fantasia",reads:690,featured:true,cover:2,description:"Uma biblioteca impossível guarda livros capazes de alterar o destino de quem ousa escrever neles.",content:"Capítulo 1 — A biblioteca\n\nNinguém sabia ao certo quando a biblioteca havia surgido. Alguns diziam que estava ali antes da cidade; outros, que aparecia apenas para quem precisava encontrá-la.\n\nTheo chegou numa tarde de chuva, seguindo uma luz que escapava por uma porta estreita. Lá dentro, milhares de livros ocupavam estantes que desapareciam no escuro.\n\nUm volume caiu sozinho diante dele. Não tinha título, apenas seu nome escrito na capa. Quando abriu a primeira página, encontrou uma frase que ainda não havia dito em voz alta."},
 {id:"s5",title:"Depois da meia-noite",author:"Bianca Reis",genre:"Terror",reads:610,featured:false,cover:5,description:"Toda noite, às 00h01, alguém bate à porta do apartamento 304. O problema é que o prédio está vazio.",content:"Capítulo 1 — Três batidas\n\nA primeira batida veio às 00h01. Júlia olhou para o relógio e depois para a porta. O corredor estava apagado.\n\nA segunda batida foi mais forte. Ela pegou o celular, mas não havia sinal. O elevador permanecia parado no térreo desde a noite anterior.\n\nA terceira batida veio de dentro do apartamento.\n\nJúlia não se moveu. Do outro lado da sala, a porta do quarto começou a abrir lentamente."},
 {id:"s6",title:"Mapa para recomeçar",author:"Pedro Martins",genre:"Desenvolvimento pessoal",reads:540,featured:false,cover:4,description:"Pequenas mudanças de rotina, reflexões e exercícios para construir um caminho mais consciente.",content:"Introdução\n\nRecomeçar não exige que você tenha todas as respostas. Às vezes, o primeiro passo é apenas perceber onde está e escolher uma direção possível.\n\nEste livro não oferece fórmulas mágicas. Ele reúne perguntas, práticas simples e ideias para ajudar você a organizar prioridades e transformar intenção em ação.\n\nComece pequeno. Observe o que funciona. Ajuste o caminho sem confundir velocidade com progresso."},
 {id:"s7",title:"O mar de vidro",author:"Ana Luiza Melo",genre:"Aventura",reads:430,featured:false,cover:6,description:"Uma expedição atravessa um oceano congelado em busca de uma cidade que aparece nos mapas antigos.",content:"Capítulo 1 — A expedição\n\nO mar parecia feito de vidro. Sob a luz azulada da manhã, cada rachadura refletia o céu e escondia profundidades que ninguém conhecia.\n\nMaya ajustou as luvas e conferiu a bússola. O ponteiro girava sem parar desde que deixaram o último abrigo.\n\nNo horizonte, uma torre surgiu entre a neblina. Não estava no mapa de ontem. Mesmo assim, todos reconheceram o símbolo gravado em sua ponta."},
 {id:"s8",title:"Café com estrelas",author:"Sofia Lima",genre:"Romance",reads:390,featured:false,cover:8,description:"Dois desconhecidos dividem uma mesa, um café e conversas que mudam a rotina dos dois.",content:"Capítulo 1 — A mesa da janela\n\nO café estava quase fechando quando André percebeu que a única mesa livre já estava ocupada por um livro aberto e uma xícara pela metade.\n\n— Posso dividir? — perguntou.\n\nA garota levantou os olhos e sorriu como se já esperasse por aquela pergunta. Do lado de fora, a chuva transformava as luzes da rua em pequenas estrelas.\n\nEles conversaram até o funcionário apagar metade das luzes. Nenhum dos dois perguntou as horas."}
];
const $ = (selector, root = document) => root.querySelector(selector);
const state = { category: "Todos", query: "", sort: "popular", books: [], user: null, font: 18 };
let authMode = "signIn";
let supabaseClient = null;

function setNotice(message, tone = "info") {
  const notice = $("#serviceStatus");
  notice.textContent = message;
  notice.dataset.tone = tone;
  notice.classList.remove("hidden");
}

function clearNotice() {
  $("#serviceStatus").classList.add("hidden");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function allBooks() {
  return [...state.books, ...sampleBooks];
}

function card(book) {
  return `<article class="book-card" data-id="${escapeHTML(book.id)}" tabindex="0" role="button" aria-label="Ler ${escapeHTML(book.title)}"><div class="cover cover-${book.cover || 1}"><span class="cover-label">LELIVROS • ${escapeHTML(book.genre)}</span><strong>${escapeHTML(book.title)}</strong><small>${escapeHTML(book.author)}</small></div><div class="book-meta"><p class="book-genre">${escapeHTML(book.genre)}</p><h3>${escapeHTML(book.title)}</h3><p>${escapeHTML(book.author)}</p></div></article>`;
}

function filteredBooks() {
  let list = allBooks().filter(book =>
    (state.category === "Todos" || book.genre === state.category) &&
    `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(state.query.toLowerCase())
  );
  if (state.sort === "popular") list.sort((a, b) => b.reads - a.reads);
  if (state.sort === "recent") {
    list.sort((a, b) => Date.parse(b.created_at || 0) - Date.parse(a.created_at || 0));
  }
  if (state.sort === "title") list.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
  return list;
}

function renderBooks() {
  const list = filteredBooks();
  $("#bookGrid").innerHTML = list.map(card).join("");
  $("#resultCount").textContent = `${list.length} ${list.length === 1 ? "livro encontrado" : "livros encontrados"}`;
  $("#emptyState").classList.toggle("hidden", list.length !== 0);
  $("#featuredGrid").innerHTML = allBooks().filter(book => book.featured).slice(0, 4).map(card).join("");
}

function setCategory(category) {
  state.category = category;
  document.querySelectorAll(".category-chip").forEach(button =>
    button.classList.toggle("active", button.dataset.category === category)
  );
  renderBooks();
}

function openReader(id) {
  const book = allBooks().find(item => item.id === id);
  if (!book) return;
  $("#homeView").classList.add("hidden");
  $("#readerView").classList.remove("hidden");
  $("#readerTitle").textContent = book.title;
  $("#readerAuthor").textContent = `por ${book.author}`;
  $("#readerGenre").textContent = book.genre.toUpperCase();
  $("#readerBody").innerHTML = book.content.split(/\n\s*\n/).map(paragraph =>
    `<p>${escapeHTML(paragraph)}</p>`
  ).join("");
  $("#readerBody").style.fontSize = `${state.font}px`;
  $("#readingProgress").style.width = "0%";
  window.scrollTo(0, 0);
}

function closeReader() {
  $("#readerView").classList.add("hidden");
  $("#homeView").classList.remove("hidden");
  window.scrollTo(0, 0);
}

function showAuthMessage(message, tone = "info") {
  const element = $("#authMessage");
  element.textContent = message;
  element.dataset.tone = tone;
  element.classList.remove("hidden");
}

function updateAuthMode() {
  const isSignUp = authMode === "signUp";
  const isReset = authMode === "reset";
  const isPasswordUpdate = authMode === "updatePassword";
  $("#modalTitle").textContent = isSignUp ? "Crie sua conta." : isReset ? "Recupere sua senha." : "Entre para publicar.";
  if (isPasswordUpdate) $("#modalTitle").textContent = "Defina sua nova senha.";
  $("#authDescription").textContent = isSignUp
    ? "Crie uma conta gratuita para publicar e gerenciar seus livros."
    : isReset
      ? "Informe seu e-mail e enviaremos um link seguro para redefinir sua senha."
      : "Entre na sua conta para publicar e gerenciar seus livros.";
  if (isPasswordUpdate) $("#authDescription").textContent = "Escolha uma senha nova para proteger sua conta.";
  $("#authSubmit").textContent = isSignUp ? "Criar conta" : isReset ? "Enviar link de recuperação" : isPasswordUpdate ? "Salvar nova senha" : "Entrar";
  $("#authEmail").classList.toggle("hidden", isPasswordUpdate);
  $("#authEmailLabel").classList.toggle("hidden", isPasswordUpdate);
  $("#authEmail").required = !isPasswordUpdate;
  $("#authPassword").classList.toggle("hidden", isReset);
  $("#authPasswordLabel").classList.toggle("hidden", isReset);
  $("#authPassword").required = !isReset;
  $("#authPassword").autocomplete = isSignUp || isPasswordUpdate ? "new-password" : "current-password";
  $("#authToggle").textContent = isSignUp ? "Já tenho uma conta" : isReset || isPasswordUpdate ? "Voltar para entrar" : "Criar conta";
  $("#authToggle").classList.toggle("hidden", isPasswordUpdate);
  $("#forgotPassword").classList.toggle("hidden", isSignUp || isReset || isPasswordUpdate);
  $("#authMessage").classList.add("hidden");
}

function openAuthModal(mode = "signIn") {
  authMode = mode;
  updateAuthMode();
  $("#authForm").classList.toggle("hidden", !supabaseClient);
  $("#authUnavailable").classList.toggle("hidden", Boolean(supabaseClient));
  $("#authUnavailable").textContent = supabaseClient
    ? ""
    : "O login ainda não foi configurado. Você pode explorar os livros de exemplo enquanto o serviço é preparado.";
  $("#modalOverlay").classList.remove("hidden");
}

function openDrawer() {
  if (!state.user) {
    openAuthModal();
    return;
  }
  $("#authorDrawer").classList.add("open");
  $("#authorDrawer").setAttribute("aria-hidden", "false");
  $("#drawerScrim").classList.remove("hidden");
  renderAuthorPanel();
}

function renderAuthorPanel() {
  const mine = state.books.filter(book => book.author_id === state.user?.id);
  $("#authorName").textContent = state.user?.email || "Meu espaço de autor";
  $("#statBooks").textContent = mine.length;
  $("#statReads").textContent = mine.reduce((total, book) => total + (book.reads || 0), 0);
  $("#authorBooks").innerHTML = mine.length
    ? mine.map(book => `<div class="author-book-item"><div><strong>${escapeHTML(book.title)}</strong><span>${escapeHTML(book.genre)} · Publicado na biblioteca</span></div><button data-delete="${escapeHTML(book.id)}">Excluir</button></div>`).join("")
    : '<p class="empty-author-books">Você ainda não publicou nenhum livro.</p>';
}

function updateAuthorUI() {
  const button = $("#authorButton");
  button.textContent = state.user ? "Meu painel" : "Entrar";
  button.onclick = state.user ? openDrawer : () => openAuthModal();
  $("#bannerAuthorButton").textContent = state.user ? "Abrir meu painel →" : "Começar a publicar →";
  $("#bannerAuthorButton").onclick = state.user ? openDrawer : () => openAuthModal();
}

function closeDrawer() {
  $("#authorDrawer").classList.remove("open");
  $("#authorDrawer").setAttribute("aria-hidden", "true");
  $("#drawerScrim").classList.add("hidden");
}

function openBookModal() {
  if (!state.user) {
    openAuthModal();
    return;
  }
  $("#bookModalOverlay").classList.remove("hidden");
}

function closeBookModal() {
  $("#bookModalOverlay").classList.add("hidden");
}

function friendlyAuthError(error) {
  const message = (error?.message || "").toLowerCase();
  if (message.includes("invalid login credentials")) return "E-mail ou senha incorretos. Confira os dados e tente novamente.";
  if (message.includes("email not confirmed")) return "Confirme seu e-mail pelo link enviado antes de entrar.";
  if (message.includes("already registered") || message.includes("user already registered")) return "Este e-mail já tem uma conta. Entre ou recupere sua senha.";
  if (message.includes("password") && message.includes("at least")) return "Escolha uma senha com pelo menos 8 caracteres.";
  if (message.includes("rate limit") || message.includes("too many requests")) return "Muitas tentativas em pouco tempo. Aguarde um pouco e tente novamente.";
  if (message.includes("fetch")) return "Não foi possível conectar. Verifique sua internet e tente novamente.";
  console.error("Falha na autenticação do Supabase:", error);
  return "Não foi possível concluir agora. Verifique os dados e tente novamente.";
}

async function loadBooks() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from("books")
      .select("id, author_id, title, author, genre, description, content, reads, cover, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    state.books = data.map(book => ({ ...book, featured: false }));
    renderBooks();
    if (state.user) renderAuthorPanel();
    clearNotice();
  } catch (error) {
    console.error("Falha ao carregar os livros:", error);
    setNotice("Não foi possível atualizar a biblioteca online. Os livros de exemplo continuam disponíveis.", "error");
  }
}

function configureSupabase() {
  const config = window.LELIVROS_CONFIG || {};
  const url = config.supabaseUrl;
  const anonKey = config.supabaseAnonKey;
  let validUrl = false;
  try {
    const parsedUrl = new URL(url);
    validUrl = parsedUrl.protocol === "https:" ||
      (parsedUrl.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsedUrl.hostname));
  } catch {
    validUrl = false;
  }
  if (!validUrl || !anonKey || !window.supabase?.createClient) {
    setNotice("Modo de leitura: livros de exemplo estão disponíveis. Login e publicação ficam ativos quando o Supabase for configurado.", "warning");
    return;
  }
  try {
    supabaseClient = window.supabase.createClient(url, anonKey);
    clearNotice();
  } catch (error) {
    supabaseClient = null;
    console.error("Configuração do Supabase inválida:", error);
    setNotice("Não foi possível iniciar o login. Confira as configurações públicas do Supabase.", "error");
  }
}

configureSupabase();

$("#searchInput").addEventListener("input", event => {
  state.query = event.target.value;
  renderBooks();
});
$("#categoryList").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (button) setCategory(button.dataset.category);
});
$("#sortSelect").addEventListener("change", event => {
  state.sort = event.target.value;
  renderBooks();
});
document.addEventListener("click", event => {
  const bookCard = event.target.closest(".book-card");
  if (bookCard) openReader(bookCard.dataset.id);
});
document.addEventListener("keydown", event => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".book-card")) {
    event.preventDefault();
    openReader(event.target.dataset.id);
  }
  if (event.key === "Escape") {
    closeBookModal();
    $("#modalOverlay").classList.add("hidden");
    closeDrawer();
  }
});
$("#clearFilters").onclick = () => {
  state.query = "";
  state.category = "Todos";
  $("#searchInput").value = "";
  setCategory("Todos");
};
$("#authorButton").onclick = () => state.user ? openDrawer() : openAuthModal();
$("#bannerAuthorButton").onclick = () => state.user ? openDrawer() : openAuthModal();
$("#closeModal").onclick = () => $("#modalOverlay").classList.add("hidden");
$("#authToggle").onclick = () => {
  authMode = authMode === "signIn" ? "signUp" : "signIn";
  updateAuthMode();
};
$("#forgotPassword").onclick = () => {
  authMode = "reset";
  updateAuthMode();
};
$("#authForm").addEventListener("submit", async event => {
  event.preventDefault();
  if (!supabaseClient) return;
  const form = new FormData(event.currentTarget);
  const email = String(form.get("email")).trim();
  const password = String(form.get("password") || "");
  const button = $("#authSubmit");
  button.disabled = true;
  try {
    if (authMode === "updatePassword") {
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) throw error;
      $("#modalOverlay").classList.add("hidden");
      setNotice("Senha atualizada com sucesso.", "success");
    } else if (authMode === "reset") {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${window.location.pathname}`
      });
      if (error) throw error;
      showAuthMessage("Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.", "success");
    } else if (authMode === "signUp") {
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}${window.location.pathname}` }
      });
      if (error) throw error;
      showAuthMessage("Conta criada. Confira sua caixa de entrada para confirmar o e-mail e entrar.", "success");
    } else {
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      $("#modalOverlay").classList.add("hidden");
    }
  } catch (error) {
    showAuthMessage(friendlyAuthError(error), "error");
  } finally {
    button.disabled = false;
  }
});
$("#closeDrawer").onclick = closeDrawer;
$("#drawerScrim").onclick = closeDrawer;
$("#newBookButton").onclick = () => {
  closeDrawer();
  openBookModal();
};
$("#closeBookModal").onclick = closeBookModal;
$("#bookForm").addEventListener("submit", async event => {
  event.preventDefault();
  if (!state.user || !supabaseClient) {
    openAuthModal();
    return;
  }
  const form = new FormData(event.currentTarget);
  const button = event.currentTarget.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    const { data, error } = await supabaseClient.from("books").insert({
      author_id: state.user.id,
      title: String(form.get("title")).trim(),
      author: String(form.get("author")).trim(),
      genre: form.get("genre"),
      description: String(form.get("description")).trim(),
      content: String(form.get("content")).trim(),
      cover: (state.books.length % 8) + 1
    }).select("id, author_id, title, author, genre, description, content, reads, cover, created_at").single();
    if (error) throw error;
    state.books.unshift({ ...data, featured: false });
    event.currentTarget.reset();
    closeBookModal();
    renderBooks();
    openDrawer();
    setNotice("Livro publicado e salvo na biblioteca online.", "success");
  } catch (error) {
    console.error("Falha ao publicar o livro:", error);
    setNotice("Não foi possível publicar o livro. Confira sua conexão e tente novamente.", "error");
  } finally {
    button.disabled = false;
  }
});
$("#authorBooks").addEventListener("click", async event => {
  const button = event.target.closest("[data-delete]");
  if (!button || !state.user || !window.confirm("Excluir este livro da biblioteca?")) return;
  button.disabled = true;
  try {
    const { data, error } = await supabaseClient.from("books")
      .delete()
      .eq("id", button.dataset.delete)
      .select("id")
      .single();
    if (error) throw error;
    if (!data) throw new Error("Nenhum livro foi excluído.");
    state.books = state.books.filter(book => book.id !== data.id);
    renderAuthorPanel();
    renderBooks();
    setNotice("Livro excluído da biblioteca.", "success");
  } catch (error) {
    console.error("Falha ao excluir o livro:", error);
    setNotice("Não foi possível excluir o livro. Atualize a página e tente novamente.", "error");
    button.disabled = false;
  }
});
$("#signOutButton").onclick = async () => {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    closeDrawer();
    setNotice("Você saiu da sua conta.", "success");
  } catch (error) {
    console.error("Falha ao sair da conta:", error);
    setNotice("Não foi possível sair agora. Tente novamente.", "error");
  }
};
$("#backToCatalog").onclick = closeReader;
$("#readerBackButton").onclick = closeReader;
$("#fontDown").onclick = () => {
  state.font = Math.max(14, state.font - 1);
  $("#readerBody").style.fontSize = `${state.font}px`;
};
$("#fontUp").onclick = () => {
  state.font = Math.min(26, state.font + 1);
  $("#readerBody").style.fontSize = `${state.font}px`;
};
window.addEventListener("scroll", () => {
  if ($("#readerView").classList.contains("hidden")) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  $("#readingProgress").style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}, { passive: true });
$("#mobileSearch").onclick = () => {
  const search = $("#searchInput");
  search.classList.toggle("mobile-open");
  if (search.classList.contains("mobile-open")) search.focus();
};
document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    $("#searchInput").classList.add("mobile-open");
    $("#searchInput").focus();
  }
});

renderBooks();
updateAuthorUI();
if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange((event, session) => {
    state.user = session?.user || null;
    if (event === "SIGNED_OUT") state.books = [];
    if (event === "SIGNED_IN") $("#modalOverlay").classList.add("hidden");
    if (event === "PASSWORD_RECOVERY") openAuthModal("updatePassword");
    updateAuthorUI();
    if (state.user) renderAuthorPanel();
    else closeDrawer();
    window.setTimeout(() => {
      renderBooks();
      void loadBooks();
    }, 0);
  });
  void loadBooks();
}
