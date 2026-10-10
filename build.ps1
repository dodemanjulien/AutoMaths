# AutoMaths – build.ps1 : génère automaths-standalone.html (v7)
param([string]$Root = $PSScriptRoot)
$sw  = [Diagnostics.Stopwatch]::StartNew()
$enc = [System.Text.UTF8Encoding]::new($false)

$html = [System.IO.File]::ReadAllText("$Root\index.html", $enc)
$css  = [System.IO.File]::ReadAllText("$Root\style.css",  $enc)
$jsFiles = @('theme_assets.js','lesson-hints.js','gamification.js','minigame.js','gen-cap-c1.js','gen-cap-c2.js','gen-bac2nde.js','gen-bac1ere.js','gen-bac-term.js','curriculum.js','app.js')

# Trouver la coupure HTML (avant <!-- SCRIPTS -->)
$cutPos = $html.IndexOf('<!-- SCRIPTS')
if ($cutPos -lt 0) { $cutPos = $html.IndexOf('<script src="gen-cap-c1.js">') }
if ($cutPos -lt 0) { Write-Error "Marqueur de coupure introuvable"; exit 1 }
$htmlHead = $html.Substring(0, $cutPos)

$sb = [System.Text.StringBuilder]::new()

# Supprimer le lien style.css externe
$htmlHeadClean = $htmlHead -replace '<link[^>]+href="style\.css"[^>]*/?>',''
[void]$sb.AppendLine($htmlHeadClean)
[void]$sb.AppendLine('<style>')
[void]$sb.AppendLine($css)
[void]$sb.AppendLine('</style>')

foreach ($f in $jsFiles) {
  $src = [System.IO.File]::ReadAllText("$Root\$f", $enc)
  [void]$sb.AppendLine('<script>')
  [void]$sb.AppendLine("/* === $f === */")
  [void]$sb.AppendLine($src)
  [void]$sb.AppendLine('</script>')
}
[void]$sb.AppendLine('</body>')
[void]$sb.AppendLine('</html>')

$out = "$Root\automaths-standalone.html"
[System.IO.File]::WriteAllText($out, $sb.ToString(), $enc)
$sw.Stop()

$chk  = [System.IO.File]::ReadAllText($out, $enc)
$nBlk = ([regex]::Matches($chk,'<script>')).Count
$kb   = [math]::Round((Get-Item $out).Length/1KB,1)
Write-Host "Build OK en $([math]::Round($sw.Elapsed.TotalSeconds,2))s => automaths-standalone.html ($kb KB, $nBlk blocs <script>)"

$checks = [ordered]@{
  '11 blocs script'         = ($nBlk -eq 11)
  'lesson-hints'           = $chk.Contains('window.LESSON_HINTS')
  'btn-start'              = $chk.Contains('btn-start')
  'CSS gradient'           = $chk.Contains('radial-gradient')
  'genDerivative'          = $chk.Contains('genDerivative')
  'makeCheckStr'           = $chk.Contains('makeCheckStr')
  'window.CURRICULUM'      = $chk.Contains('window.CURRICULUM')
  'initApp'                = $chk.Contains('initApp')
  'GamificationEngine'     = $chk.Contains('GamificationEngine')
  'MiniGameEngine'         = $chk.Contains('MiniGameEngine')
  'pseudo-overlay'         = $chk.Contains('pseudo-overlay')
  'No href style.css'      = !$chk.Contains('href="style.css"')
  'No src gen-*.js'        = !$chk.Contains('src="gen-')
}
foreach ($k in $checks.Keys) {
  Write-Host ($(if($checks[$k]){'[OK  ]'}else{'[FAIL]'})+' '+$k)
}
