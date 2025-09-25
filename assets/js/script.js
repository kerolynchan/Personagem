document.addEventListener("DOMContentLoaded", function() {

    // ==============================
    // Mostrar campos manuais
    // ==============================
    const camposManuais = [
        {select: 'raca', manual: 'raca_outro'},
        {select: 'formato_rosto', manual: 'formato_rosto_manual'},
        {select: 'tipo_cabelo', manual: 'tipo_cabelo_manual'},
        {select: 'penteado', manual: 'penteado_manual'},
        {select: 'franja', manual: 'franja_manual'},
        {select: 'barba', manual: 'barba_manual'},
        {select: 'cor_cabelo', manual: 'cor_cabelo_manual'},
        {select: 'mechas', manual: 'mechas_manual'},
        {select: 'marcas', manual: 'marcas_manual'},
        {select: 'cor_olhos', manual: 'cor_olhos_manual'},
        {select: 'expressao', manual: 'expressao_manual'},
        {select: 'tom_pele', manual: 'tom_pele_manual'},
        {select: 'roupas', manual: 'roupas_manual'},
        {select: 'acessorios', manual: 'acessorios_manual'},
        {select: 'fundo', manual: 'fundo_manual'}
    ];

    camposManuais.forEach(c => {
        const sel = document.querySelector(`select[name="${c.select}"]`);
        const man = document.querySelector(`input[name="${c.manual}"]`);
        if(sel && man){
            sel.addEventListener('change', function() {
                if(this.value.toLowerCase() === "manual" || this.value.toLowerCase() === "outro"){
                    man.style.display = 'block';
                } else {
                    man.style.display = 'none';
                    man.value = "";
                }
                atualizarPreco();
            });
        }
    });

    // ==============================
    // Cupons de desconto
    // ==============================
    const cupons = {
        "KERO1OFF_SK": 1, "KERO2OFF_AN": 2, "KERO3OFF_MG": 3, "KERO4OFF_CH": 4,
        "KERO5OFF_PS": 5, "KERO6OFF_AR": 6, "KERO7OFF_CL": 7, "KERO8OFF_LN": 8,
        "KERO9OFF_CN": 9, "KERO10OFF_DS": 10, "KERO11OFF_PL": 11, "KERO12OFF_TL": 12,
        "KERO13OFF_CV": 13, "KERO14OFF_SB": 14, "KERO15OFF_FN": 15, "KERO16OFF_AT": 16,
        "KERO17OFF_PT": 17, "KERO18OFF_IL": 18, "KERO19OFF_HQ": 19, "KERO20OFF_CH": 20
    };

    let cupomAplicado = null;

    const inputCupom = document.getElementById("cupomInput");
    const btnAplicarCupom = document.getElementById("aplicarCupom");

    btnAplicarCupom.addEventListener("click", function() {
        const codigo = inputCupom.value.trim().toUpperCase();
        if(!codigo) return;
        if(cupomAplicado){
            alert("Apenas um cupom pode ser aplicado por vez.");
            return;
        }
        if(cupons[codigo]){
            cupomAplicado = {codigo: codigo, desconto: cupons[codigo]};
            alert(`Cupom aplicado! Desconto de ${cupons[codigo]}%`);
        } else {
            alert("Cupom inválido.");
            inputCupom.value = "";
        }
        atualizarPreco();
    });

    // ==============================
    // Atualizar preço
    // ==============================
    function atualizarPreco(){
        let total = 0;

        // Soma selects
        document.querySelectorAll('select').forEach(select => {
            const opcao = select.options[select.selectedIndex];
            if(opcao) total += parseFloat(opcao.dataset.preco || 0);
        });

        // Soma checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(chk => {
            if(chk.checked) total += parseFloat(chk.dataset.preco || 0);
        });

        // Serviço expresso
        const servicoExpresso = document.getElementById("servicoExpresso");
        if(servicoExpresso && servicoExpresso.checked){
            total += total * 0.10;
        }

        // Atualiza preço na tela
        const precoContainer = document.getElementById('precoTotal');

        if(cupomAplicado){
            const desconto = total * (cupomAplicado.desconto / 100);
            const precoComDesconto = total - desconto;
            precoContainer.innerHTML = `
                Preço atual: R$ ${total.toFixed(2)}
                <br>
                <span style="text-decoration: line-through; color: red;">R$ ${total.toFixed(2)}</span>
                &nbsp;&nbsp;
                <span>Preço com desconto: R$ ${precoComDesconto.toFixed(2)}</span>
            `;
        } else {
            precoContainer.innerHTML = `Preço atual: R$ ${total.toFixed(2)}`;
        }
    }

    document.querySelectorAll('select, input[type="checkbox"]').forEach(el => {
        el.addEventListener('change', atualizarPreco);
    });
    atualizarPreco();

    // ==============================
    // Envio de pedido via WhatsApp
    // ==============================
    document.getElementById('enviarPedido').addEventListener('click', function() {
        const form = document.getElementById('personagemForm');
        const formData = new FormData(form);
        let mensagem = "*📋 Formulário de Encomenda – Personagem Digital*\n\n";

        for (let [key, value] of formData.entries()) {
            if(value) mensagem += `*${key.replace(/_/g, ' ')}:* ${value}\n`;
        }

        // Adiciona preços
        const precoContainer = document.getElementById('precoTotal');
        const precoAtual = precoContainer.innerText.split('\n')[0] || '';
        const precoComDesconto = precoContainer.innerText.includes("Preço com desconto") ? precoContainer.innerText.split('\n')[2] : '';

        mensagem += `\n*${precoAtual}*`;
        if(precoComDesconto) mensagem += `\n*${precoComDesconto}*`;

        const numeroZap = "+5521978046832"; 
        const url = `https://api.whatsapp.com/send?phone=${numeroZap}&text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    });

    // ==============================
    // Paleta de cores
    // ==============================
    const colorInput = document.getElementById("colorInput");
    const colorValue = document.getElementById("colorValue");
    const copyBtn = document.getElementById("copyColor");

    if(colorInput && colorValue && copyBtn){
        colorValue.value = colorInput.value;

        colorInput.addEventListener("input", () => {
            colorValue.value = colorInput.value;
        });

        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(colorValue.value);
            copyBtn.textContent = "Copiado!";
            setTimeout(() => copyBtn.textContent = "Copiar", 1500);
        });
    }

    // ==============================
    // Poses extras
    // ==============================
    const posesSelect = document.getElementById('poses');
    const descricaoInput = document.getElementById('descricaoPoses');

    if(posesSelect && descricaoInput){
        posesSelect.addEventListener('change', () => {
            if (posesSelect.value !== "") {
                descricaoInput.style.display = "block";
            } else {
                descricaoInput.style.display = "none";
                descricaoInput.value = "";
            }
        });
    }

});
