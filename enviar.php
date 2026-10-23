<?php
// Endpoint de contato do site Heryzon/Vozzi.
// Recebe o formulário via POST e envia o e-mail para contato@heryzon.com.br.

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método não permitido.']);
    exit;
}

// Honeypot anti-spam: campo invisível que humanos não preenchem.
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$organization = trim($_POST['organization'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Preencha nome, e-mail válido e mensagem.']);
    exit;
}

// Remove quebras de linha de campos usados em cabeçalhos (anti header-injection).
$cleanName = preg_replace('/[\r\n]+/', ' ', $name);
$cleanEmail = preg_replace('/[\r\n]+/', ' ', $email);

$to = 'contato@heryzon.com.br';
$subjectText = 'Contato pelo site: ' . $cleanName;
$subject = '=?UTF-8?B?' . base64_encode($subjectText) . '?=';

$body = "Nome: {$name}\n";
$body .= "E-mail: {$email}\n";
$body .= 'Organização: ' . ($organization !== '' ? $organization : '-') . "\n\n";
$body .= "Mensagem:\n{$message}\n";

$headers = "From: Site Heryzon <contato@heryzon.com.br>\r\n";
$headers .= "Reply-To: {$cleanEmail}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Envelope sender (-f): alinha Return-Path/SPF e melhora a entrega.
$sent = @mail($to, $subject, $body, $headers, '-fcontato@heryzon.com.br');

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Não foi possível enviar agora. Tente novamente ou escreva para contato@heryzon.com.br.',
    ]);
}
