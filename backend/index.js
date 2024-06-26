const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const SUPABASE_URL = 'https://htuzeeiqjyrgdxvwrfuu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0dXplZWlxanlyZ2R4dndyZnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzNjU2MDUsImV4cCI6MjAzNDk0MTYwNX0.Vv1375LUthj9_eAFW2_rx9KTzFo2sbDFib8LtH97NxA';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let players = {};

// Serve the frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

io.on('connection', async (socket) => {
    console.log(`Player connected: ${socket.id}`);
    
    let { data: player, error } = await supabase
        .from('players')
        .insert([{ id: socket.id, x: Math.floor(Math.random() * 500), y: Math.floor(Math.random() * 500) }])
        .single();
    
    players[socket.id] = player;

    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', { playerId: socket.id, playerInfo: players[socket.id] });

    socket.on('disconnect', async () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        await supabase
            .from('players')
            .delete()
            .eq('id', socket.id);
        io.emit('playerDisconnected', socket.id);
    });

    socket.on('playerMovement', async (movementData) => {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        
        await supabase
            .from('players')
            .update({ x: movementData.x, y: movementData.y })
            .eq('id', socket.id);
        
        socket.broadcast.emit('playerMoved', { playerId: socket.id, playerInfo: players[socket.id] });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
