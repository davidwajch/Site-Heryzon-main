<?php
// Endpoint de contato do site Heryzon/Vozzi.
// Recebe o formulário via POST e envia o e-mail para contato@heryzon.com.br.

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

// Honeypot anti-spam: campo invisível que humanos não preenchem.
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

function field($key)
{
    return trim((string) ($_POST[$key] ?? ''));
}

$name = field('name');
$email = field('email');
$company = field('company');
$industry = field('industry');
$volume = field('volume');
$interest = field('interest');
$message = field('message');
$lang = field('lang') === 'en' ? 'Inglês' : 'Português';

// Os valores das listas chegam como códigos, iguais nos dois idiomas do site.
$interests = [
    'piloto' => 'Ser piloto',
    'investimento' => 'Falar sobre investimento',
    'outro' => 'Outro assunto',
];
$volumes = [
    'ate-1000' => 'Até 1.000',
    '1000-5000' => '1.000 a 5.000',
    '5000-20000' => '5.000 a 20.000',
    'mais-20000' => 'Mais de 20.000',
    'nao-sei' => 'Não sei',
];
$interestLabel = $interests[$interest] ?? 'Outro assunto';
$volumeLabel = $volumes[$volume] ?? '-';

$tooLong = strlen($name) > 200 || strlen($email) > 200 || strlen($company) > 200
    || strlen($industry) > 200 || strlen($message) > 5000;

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $tooLong) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_fields']);
    exit;
}

// Remove quebras de linha de campos usados em cabeçalhos (anti header-injection).
$cleanName = preg_replace('/[\r\n]+/', ' ', $name);
$cleanEmail = preg_replace('/[\r\n]+/', ' ', $email);

$to = 'contato@heryzon.com.br';
$subjectText = $interestLabel . ' - ' . $cleanName;
$subject = '=?UTF-8?B?' . base64_encode($subjectText) . '?=';

$orDash = function ($value) {
    return $value !== '' ? $value : '-';
};

$body = "Assunto: {$interestLabel}\n";
$body .= "Nome: {$cleanName}\n";
$body .= "E-mail: {$cleanEmail}\n";
$body .= 'Empresa: ' . $orDash($company) . "\n";
$body .= 'Segmento: ' . $orDash($industry) . "\n";
$body .= "Ligações por mês: {$volumeLabel}\n";
$body .= "Idioma do site: {$lang}\n\n";
$body .= "Mensagem:\n" . $orDash($message) . "\n";

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
    echo json_encode(['ok' => false, 'error' => 'send_failed']);
}
