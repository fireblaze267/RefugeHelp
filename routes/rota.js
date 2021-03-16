module.exports = function (app) {
    var multer = require('multer');
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'public/img/');
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + '-' + file.originalname);
        }
      });
      var upload = multer({ storage: storage });
    /*rotas*/

    app.get('/', function (req, res) {
        var sess = req.session;
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.notlista(function (erro, resposta){
        if (sess.logado) {
            if (sess.logado == 1 || sess.logado == 2 || sess.logado == 3) {
                res.render('index.ejs', {
                    'sess': sess,
                    'not': resposta
                });
            }
        } else {
            res.render('index.ejs', {
                'not': resposta 
            });
        }
    });
});


    app.get('/noticias', function (req, res) {
        var sess = req.session;
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.notlista(function (erro, resposta) {
            if (sess.logado) {
                if (sess.logado == 1 || sess.logado == 2 || sess.logado == 3) {
                    res.render('noticias.ejs', {
                        'sess': sess,
                        'not': resposta
                    });
                }
            } else {
                res.render('noticias.ejs', {
                    'not': resposta
                });
            }
        });
    });



    app.get('/refugiados', function (req, res) {
        var sess = req.session;
        if (sess.logado) {
            if (sess.logado == 1 || sess.logado == 2 || sess.logado == 3) {
                res.render('refugiados.ejs', {
                    'sess': sess
                });
            }
        } else {
            res.render('refugiados.ejs');
        }
    });


    app.get('/ongs', function (req, res) {
        var sess = req.session;
        if (sess.logado) {
            if (sess.logado == 1 || sess.logado == 2 || sess.logado == 3) {
                res.render('ongs.ejs', {
                    'sess': sess
                });
            }
        } else {
            res.render('ongs.ejs');
        }
    });
    app.get('/sobre', function (req, res) {
        var sess = req.session;
        if (sess.logado) {
            if (sess.logado == 1 || sess.logado == 2 || sess.logado == 3) {
                res.render('sobre.ejs', {
                    'sess': sess
                });
            }
        } else {
            res.render('sobre.ejs');
        }
    });


    app.get('/adm', function (req, res) {
        var sess = req.session;
        if (sess.logado == 2) {
            res.render('adm-page.ejs');
        } else if (sess.logado == 3) {
            res.redirect('/mod')
        } else {
            res.render('adm.ejs');
        }
    });


    app.get('/mod', function (req, res) {
        var sess = req.session;
        var nome = sess.nome;
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.notlista(function (erro, not) {
            usuarioBanco.mod(nome, function (erro, resposta) {
                if (sess.logado == 3) {
                    res.render('mod-page.ejs', {
                        'resposta': resposta,
                        'not': not
                    });
                } else if (sess.logado == 2) {
                    res.render('mod.ejs', {
                        'adm': 1
                    });
                } else {
                    res.render('mod.ejs');
                }
            });
        });
    });



    app.get('/admper', function (req, res) {
        var sess = req.session;
        if (sess.logado) {
            if (sess.logado == 0) {
                res.redirect('/');
            } else if (sess.logado == 1) {
                res.redirect('/');
            } else if (sess.logado == 2) {
                res.render('adm-page.ejs', {
                    'sess': sess
                });
            } else if (sess.logado == 3) {
                res.redirect('/modper');
            }
        } else {
            res.redirect('/');
        }
    });


    app.get('/form', function (req, res) {
        var sess = req.session;
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.listar(function (erro, resposta) {
            if (sess.logado) {
                if (sess.logado == 2 || sess.logado == 3) {
                    res.render('form.ejs')
                } else {
                    res.redirect('/');
                }

            } else {
                res.redirect('/');
            }
        });
    });


    app.get('/perfil', function (req, res) {
        var sess = req.session;
        if (sess.logado) {
            if (sess.logado == 0) {
                res.redirect('/');
            } else {
                var email = sess.email;
                var conexao = app.infra.conexao();
                var usuarioBanco = new app.infra.usuario(conexao);
                usuarioBanco.perfil(email, function (erro, resposta) {
                    if (erro) {
                        console.log(erro);
                    } else {
                        res.render('perfil.ejs', {
                            'info': resposta,
                            'sess': sess
                        });
                    }
                });
            };
        } else {
            res.redirect('/');
        }

    });


    app.get('/noticia_modelo', function (req, res) {
        res.render('noticia_modelo.ejs');
    });


    /*pagina de noticia*/
    app.get('/noticia_modelo/:id', function (req, res) {
        var sess = req.session;
        var id = req.params.id;
        var conexao = new app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.noticia(id, function (erro, resposta) {
            if (erro) {
                console.log(erro);
            } else {
                res.render('noticia_modelo.ejs', {
                    'txt': resposta,
                    'sess': sess
                });
            }
        });
    });

    /*pagina de noticia*/


    /*rotas*/


    /*moderador*/


    /*cadastrar-MOD*/
    app.post('/casmod', function (req, res) {
        var dados = req.body;
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.cadastrarmod(dados, function (erro, resposta) {
            if (erro) {
                if (erro.erro == 1062) {
                    console.log('email já cadastrado');
                    res.render('adm-page.ejs', {
                        'cas': 1
                    });
                } else {
                    console.log(erro);
                    res.render('adm-page.ejs', {
                        'cas': 2
                    });
                }
            } else {
                res.render('adm-page.ejs', {
                    'cas': 0
                });
                console.log('cadastrado com sucesso!');
            }
        });
    });
    /*cadastrar-MOD*/


    /*login-mod*/
    app.post('/modpage', function (req, res) {
        var sess = req.session;
        var dados = req.body;
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        if (dados.nome && dados.senha) {
            usuarioBanco.logarmod(dados, function (erro, resposta) {
                if (erro) {
                    console.log(erro);
                    res.render('mod.ejs', {
                        'log': 2
                    });
                } else if (resposta.length) {
                    sess.logado = 3;
                    sess.nome = dados.nome;
                    res.redirect('/mod');
                } else {
                    res.render('mod.ejs', {
                        'log': 1
                    });
                }
            });
        } else {
            console.log(dados);
            res.render('mod.ejs', {
                'log': 0
            });
        }
    });
    /*login-mod*/


    /*moderador*/


    /*sessao logar*/
    app.post('/logar', function (req, res) {
        var sess = req.session;
        var dados = req.body;
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        if (dados.email && dados.senha) {
            usuarioBanco.logar(dados, function (erro, resposta) {
                usuarioBanco.notlista(function (er, resp){
                if (erro) {
                    console.log(erro);
                    res.render('index.ejs', {
                        'log': 2,
                        'not': resp
                    });
                } else if (resposta.length) {
                    sess.logado = 1;
                    sess.email = dados.email;
                    res.redirect('/');
                } else {
                    res.render('index.ejs', {
                        'log': 1,
                        'not':resp
                    });
                }
            });
        });
        } else {
            res.render('index.ejs', {
                'log': 0,
                'not':resp
            });
        }
});
    /*sessao logar*/

    /*editar-usuario*/
    app.get('/editarperfil', function (req, res) {
        var sess = req.session
        var email = sess.email
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.perfil(email, function (erro, resposta) {
            if (sess.logado == 1) {
                res.render('usuedita.ejs', {
                    'dados': resposta
                });
            } else {
                res.redirect('/');
                Console.log(erro);
            }
        });
    });
    /*editar-usuario*/

    /*fucao editar-usuario*/
    app.post('/editarperf',function(req,res){
        var sess = req.session
        var dados = req.body
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.editar(dados,function (erro,resposta){
            if (sess.logado == 1){
                res.redirect('/perfil');
                console.log(erro)
            }else{
                res.redirect('/')
            }
        })
    })
    /*fucao editar-usuario*/



    /*cadastrar*/
    app.post('/cadastrar', function (req, res) {
        var dados = req.body;
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.cadastrar(dados, function (erro, resposta) {
            usuarioBanco.notlista(function (er, resp){
            if (erro) {
                if (erro.code == 'ER_DUP_ENTRY') {
                    console.log('email já cadastrado');
                    res.render('index.ejs', {
                        'cas': 1,
                        'not':resp
                    });
                } else {
                    console.log(erro);
                    res.render('index.ejs', {
                        'cas': 2,
                        'not':resp
                    });
                }
            } else {
                res.render('index.ejs', {
                    'cas': 0,
                    'not':resp
                });
                console.log('cadastrado com sucesso!');
            }
        });
      });
    });
    /*cadastrar*/


    /*cadastrar-ADM*/
    app.post('/cadastraradm', function (req, res) {
        var dados = req.body;
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.cadastraradm(dados, function (erro, resposta) {
            if (erro) {
                if (erro.erro == 1062) {
                    console.log('email já cadastrado');
                    res.render('adm-page.ejs', {
                        'cas': 1
                    });
                } else {
                    console.log(erro);
                    res.render('adm-page.ejs', {
                        'cas': 2
                    });
                }
            } else {
                res.render('adm-page.ejs', {
                    'cas': 0
                });
                console.log('cadastrado com sucesso!');
            }
        });
    });
    /*cadastrar-ADM*/


    /*login-adm*/
    app.post('/admpage', function (req, res) {
        var sess = req.session;
        var dados = req.body;
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        if (dados.nome && dados.senha) {
            usuarioBanco.logaradm(dados, function (erro, resposta) {
                if (erro) {
                    console.log(erro);
                    res.render('adm.ejs', {
                        'log': 2
                    });
                } else if (resposta.length) {
                    sess.logado = 2;
                    res.redirect('/admper');
                } else {
                    res.render('adm.ejs', {
                        'log': 1
                    });
                }
            });
        } else {
            console.log(dados);
            res.render('adm.ejs', {
                'log': 0
            });
        }
    });
    /*login-adm*/


    /*excluir-ADM*/
    app.post('/exadm', function (req, res) {
        var sess = req.session
        var dados = req.body;
        var nome = dados.nome
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        if (dados.nome == 'root') {
            res.render('adm-page.ejs', {
                'na': 1
            });
        } else {
            usuarioBanco.admex(nome, function (erro, resposta) {
                if (sess.logado == 2) {
                    if (erro) {
                        console.log(erro);
                    } else {
                        res.redirect('/adm');
                    }
                } else {
                    res.redirect('/')

                }
            });
        }
    });

    /*excluir-ADM*/


    /*listar usuarios*/

    app.get('/buscar', function (req, res) {
        var sess = req.session;
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.listar(function (erro, resposta) {
            if (sess.logado) {
                if (sess.logado == 2) {
                    res.render('busca.ejs', {
                        'busca': resposta
                    });
                } else {
                    res.redirect('/');
                }

            } else {
                res.redirect('/');
            }
        });
    });

    /*listar usuarios*/


    /*criar noticia*/
    app.post('/not' , upload.single('img'), function (req, res) {
        var dados = req.body;
        var file = req.file;
        var img = file.destination + file.filename;
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.not(dados,img, function (erro, resposta) {
            if (erro) {
                console.log(erro);
            } else {
                res.redirect('adm');
            }

        });
    });
    /*criar noticia*/


    /*listar noticias*/

    app.get('/listanot', function (req, res) {
        var sess = req.session;
        var conexao = app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.notlista(function (erro, resposta) {
            if (sess.logado) {
                if (sess.logado == 2 || sess.logado == 3) {
                    res.render('buscanot.ejs', {
                        'busca': resposta,
                        'sess':sess
                    });
                } else {
                    res.redirect('/');
                }

            } else {
                res.redirect('/');
            }
        });
    });

    /*listar noticias*/


    /*editar noticia*/
    app.get('/editarnot/:id', function (req, res) {
        var sess = req.session;
        var id = req.params.id;
        var conexao = new app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.noticia(id, function (erro, resposta) {
            if (sess.logado == 2 || sess.logado == 3) {
                if (erro) {
                    console.log(erro);
                } else {
                    res.render('formeditar.ejs', {
                        'not': resposta,
                        'sess': sess
                    });
                }
            } else {
                res.redirect('/')
            }
        });
    });

    /*editar noticia*/


    /*função editar noticia*/
    app.post('/editanot', function (req, res) {
        var sess = req.session;
        var dados = req.body;
        var conexao = new app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.altera(dados, function (erros, resultado) {
            if (sess.logado == 2 || sess.logado == 3) {
                if (erros) {
                    console.log(erros);
                } else {
                    console.log("alterada com sucesso!");
                    res.redirect('/listanot');
                }
            } else {
                res.redirect('/');
            }
        });
    });
    /*função editar noticia*/


    /*excluir noticias */
    app.get('/excluirnot/:id', function (req, res) {
        var sess = req.session;
        var id = req.params.id;
        var conexao = new app.infra.conexao();
        var usuarioBanco = new app.infra.usuario(conexao);
        usuarioBanco.excluirnot(id, function (erro, resposta) {
            if (sess.logado == 2 || sess.logado == 3) {
                if (erro) {
                    console.log(erro);
                } else {
                    res.redirect('/listanot');
                }
            } else {
                res.redirect('/')
            }
        });

    });

    /*excluir noticias */

    /*Fechar sessao*/
    app.get('/close', function (req, res) {
        req.session.destroy(function (erro) {
            res.redirect('/');
        })
    });
    /*Fechar sessao*/




}