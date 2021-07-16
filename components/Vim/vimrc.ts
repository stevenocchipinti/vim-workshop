const vimrc = `
set expandtab tabstop=2 shiftwidth=2 softtabstop=2 splitright
colorscheme onedark
syntax enable

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
