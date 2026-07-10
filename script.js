        const tableBody = document.getElementById('table-body');
        const btnAddRows = document.getElementById('btn-add-rows');
        const dataInicialInput = document.getElementById('data-inicial');
        const dataFinalInput = document.getElementById('data-final');
        const countVal = document.getElementById('count-val');
        const pasMediaVal = document.getElementById('pas-media-val');
        const padMediaVal = document.getElementById('pad-media-val');
        const outputText = document.getElementById('output-text');
        const btnCopy = document.getElementById('btn-copy');
        const toast = document.getElementById('toast');
        const radioOptions = document.getElementsByName('output-type');

        let rowCount = 0;

        // Inicializa com 10 linhas padrão
        function generateRows(num) {
            for (let i = 0; i < num; i++) {
                rowCount++;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="row-index">${rowCount}</td>
                    <td><input type="number" class="table-input pas-input" min="40" max="300" placeholder="---"></td>
                    <td><input type="number" class="table-input pad-input" min="30" max="200" placeholder="---"></td>
                `;
                tableBody.appendChild(row);
            }
            attachInputListeners();
        }

        function attachInputListeners() {
            const inputs = tableBody.querySelectorAll('.table-input');
            inputs.forEach(input => {
                // Evita múltiplos listeners acumulados
                input.removeEventListener('input', calculateMRPA);
                input.addEventListener('input', calculateMRPA);
            });
        }

        function formatDate(dateString) {
            if (!dateString) return '';
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        }

        function calculateMRPA() {
            const pasInputs = tableBody.querySelectorAll('.pas-input');
            const padInputs = tableBody.querySelectorAll('.pad-input');
            
            let totalPas = 0;
            let totalPad = 0;
            let validCount = 0;
            
            let pasValues = [];
            let padValues = [];

            for (let i = 0; i < pasInputs.length; i++) {
                const pas = parseInt(pasInputs[i].value, 10);
                const pad = parseInt(padInputs[i].value, 10);

                // Uma medição é válida se ambos os valores forem preenchidos
                if (!isNaN(pas) && !isNaN(pad)) {
                    totalPas += pas;
                    totalPad += pad;
                    validCount++;
                    pasValues.push(pas);
                    padValues.push(pad);
                }
            }

            const dIni = formatDate(dataInicialInput.value);
            const dFin = formatDate(dataFinalInput.value);
            let dateInterval = "";
            
            if (dIni && dFin) {
                dateInterval = ` (${dIni} a ${dFin})`;
            } else if (dIni) {
                dateInterval = ` (a partir de ${dIni})`;
            } else if (dFin) {
                dateInterval = ` (até ${dFin})`;
            }

            if (validCount > 0) {
                const pasMedia = Math.round(totalPas / validCount);
                const padMedia = Math.round(totalPad / validCount);

                countVal.textContent = validCount;
                pasMediaVal.textContent = `${pasMedia} mmHg`;
                padMediaVal.textContent = `${padMedia} mmHg`;

                // Determina o tipo de texto selecionado
                let selectedType = 'simples';
                for (const radio of radioOptions) {
                    if (radio.checked) {
                        selectedType = radio.value;
                        break;
                    }
                }

                if (selectedType === 'simples') {
                    outputText.value = `MRPA${dateInterval}: ${validCount} valores -- PAS média: ${pasMedia} / PAD média: ${padMedia}`;
                } else {
                    // Monta o texto em colunas/linhas correspondentes para visualização limpa
                    let pairsList = "";
                    for(let i=0; i < validCount; i++) {
                        pairsList += `     - ${pasValues[i]} / ${padValues[i]}\n`;
                    }
                    // Remove a última quebra de linha interna se necessário
                    pairsList = pairsList.trimEnd();

                    outputText.value = `MRPA${dateInterval}:\n${pairsList}\n     - PAS média: ${pasMedia} / PAD média: ${padMedia}`;
                }
            } else {
                countVal.textContent = "0";
                pasMediaVal.textContent = "-";
                padMediaVal.textContent = "-";
                outputText.value = "";
            }
        }

        // Listeners para mudanças nos componentes estruturais
        dataInicialInput.addEventListener('change', calculateMRPA);
        dataFinalInput.addEventListener('change', calculateMRPA);
        
        for (const radio of radioOptions) {
            radio.addEventListener('change', calculateMRPA);
        }

        btnAddRows.addEventListener('click', () => {
            generateRows(5);
        });

        // Copiar texto para a área de transferência
        btnCopy.addEventListener('click', () => {
            if (!outputText.value) return;
            
            navigator.clipboard.writeText(outputText.value).then(() => {
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 2000);
            }).catch(err => {
                console.error('Erro ao copiar texto: ', err);
            });
        });

        // Limpar todos os campos e resultados
        const btnClear = document.getElementById('btn-clear');
        btnClear.addEventListener('click', () => {
            // Limpa os inputs de data
            dataInicialInput.value = '';
            dataFinalInput.value = '';
            // Limpa a tabela
            tableBody.innerHTML = '';
            rowCount = 0;
            // Limpa os resultados
            countVal.textContent = "0";
            pasMediaVal.textContent = "-";
            padMediaVal.textContent = "-";
            outputText.value = '';
            // Gera novamente as 10 linhas padrão
            generateRows(10);
        });

        // Adicionando botão que leva a um link em outra guia para download do modelo de impressão
        const btnModel = document.getElementById('btn-model');
        btnModel.addEventListener('click', () => {
            window.open('MRPA.pdf', '_blank');
        });

        // Inicialização do App com 10 linhas
        generateRows(10);
