const vimrc = `
syntax enable
colorscheme onedark
set guifont=monospace:h15
set expandtab tabstop=2 shiftwidth=2 softtabstop=2 splitright

inoremap <s-cr> <nop>

function EndChallenge()
  write
  export
  vsplit /challenge/end
  windo diffthis
  redraw
  qall!
endfunction
`.trim()

export default vimrc
