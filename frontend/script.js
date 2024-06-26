document.addEventListener('DOMContentLoaded', () => {
    // Simula informações do jogador (substitua com dados reais ou dinâmicos)
    const playerName = 'Player1';
    const goldBalance = 100;
    const damageDealt = 0;
    const defensePerformed = 0;
    const healingProvided = 0;

    // Atualiza as informações na tela
    document.getElementById('playerName').textContent = playerName;
    document.getElementById('goldBalance').textContent = goldBalance;
    document.getElementById('damageDealt').textContent = damageDealt;
    document.getElementById('defensePerformed').textContent = defensePerformed;
    document.getElementById('healingProvided').textContent = healingProvided;

    // Event listener para o botão de iniciar partida
    document.getElementById('startGameBtn').addEventListener('click', () => {
        // Aqui você pode adicionar lógica para iniciar a partida, como redirecionar para outra página ou iniciar um processo no backend
        alert('Iniciando a partida...');
        // Exemplo: redirecionar para uma nova página
        window.location.href = '/game.html';
    });
});
