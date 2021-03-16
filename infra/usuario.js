function usuarioBanco(conexao){
    this._conexao=conexao;
}
/*noticia*/
usuarioBanco.prototype.not = function(dados,img,callback){
    this._conexao.query('insert into noticia set ?, img = ?',[dados,img],callback);
}
usuarioBanco.prototype.notlista = function(callback){
    this._conexao.query('select *from noticia order by not_date desc',callback);
}
usuarioBanco.prototype.noticia = function(id,callback){
    this._conexao.query('select * from noticia WHERE id_noticia = ?', id ,callback);
}
usuarioBanco.prototype.editarnot = function(id,callback){
    this._conexao.query('select * from noticia WHERE id_noticia = ?', id ,callback);
}
usuarioBanco.prototype.excluirnot = function(id,callback){
    this._conexao.query('DELETE from noticia WHERE id_noticia = ?', id ,callback);
}
usuarioBanco.prototype.altera = function(dados,callback){
    this._conexao.query('update noticia set ? where id_noticia= ?',[dados,dados.id_noticia],callback);
}
/*noticia*/


/*ADM*/
usuarioBanco.prototype.admex = function(nome,callback){
    this._conexao.query('delete from adm where nome = ?',nome,callback);
}
usuarioBanco.prototype.logaradm = function(dados,callback){
    this._conexao.query('select * from adm where nome = ? AND senha = ?',[dados.nome,dados.senha],callback);
}
usuarioBanco.prototype.cadastraradm = function(dados,callback){
    this._conexao.query('insert into adm set ?',dados,callback);
}
/*ADM*/


/*MOD*/
usuarioBanco.prototype.cadastrarmod = function(dados,callback){
    this._conexao.query('insert into moderador set ?',dados,callback);
}
usuarioBanco.prototype.logarmod = function(dados,callback){
    this._conexao.query('select * from moderador where nome = ? AND senha = ?',[dados.nome,dados.senha],callback);
}
usuarioBanco.prototype.mod = function(nome,callback){
    this._conexao.query('select * from moderador WHERE nome = ?',nome,callback);
}
/*MOD*/


/*usuario*/
usuarioBanco.prototype.logar = function(dados,callback){
    this._conexao.query('select * from usuario where email = ? AND senha = ?',[dados.email,dados.senha],callback);
}
usuarioBanco.prototype.cadastrar = function(dados,callback){
    this._conexao.query('insert into usuario set ?',dados,callback);
}
usuarioBanco.prototype.listar = function(callback){
    this._conexao.query('select * from usuario',callback);
}
usuarioBanco.prototype.perfil = function(email,callback){
    this._conexao.query('select * from usuario WHERE email = ?',email,callback);
}
usuarioBanco.prototype.editar = function(dados,callback){
    this._conexao.query('update usuario set ? where email = ? ',[dados,dados.email],callback);
}
/*usuario*/


module.exports = function(){

    return usuarioBanco;
}
