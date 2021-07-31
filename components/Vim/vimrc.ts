const vimrc = `
syntax enable
colorscheme onedark
set guifont=monospace:h14
set expandtab tabstop=2 shiftwidth=2 softtabstop=2 splitright nohls

inoremap <s-cr> <nop>

function EndChallenge()
  write
  export
  vsplit /challenge/end
  windo diffthis
  windo set wrap
  redraw
  qall!
endfunction
`.trim()

export default vimrc
