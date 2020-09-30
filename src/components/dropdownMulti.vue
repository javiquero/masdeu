<template>
    <div class="fmultiple" v-click-outside="click_outside">
        <label v-if="title!=''" @click="focus()">{{title}}</label>
        <div class="selector" v-bind:class="{active: dropActive}">
            <ul class="list-selecteds" @click="focus()">
                <li v-for="(item, index) in value" v-bind:key="index+item">
                    <div class="element">
                        <i @click="deleteElement(index)" class="far fa-times"></i>{{showItem(item)}}
                    </div>

                </li>
                <li><input ref="inputsearch" class="focusable" type="text" v-on:focus="click_show_drop" @keydown="keyListener($event)" v-model="search" v-on:blur="blur"></li>
            </ul>
        </div>
        <div class="drop-panel" v-bind:class="{active: dropActive}">
            <ul class="data-elements" ref="list" v-if="search!='' || showOnFocus">
                <li v-for="(item, index) in results" v-bind:key="item.id" @click="addElement(item)" @mouseenter="elementSelected=index" v-bind:class="{highlighted: index==elementSelected}">
                    <div class="content" v-html="highlightPhrase(item[fkey])">
                    </div>
                </li>
                <li v-if="allowadd" @mouseenter="e => e.target.classList.toggle('highlighted')" @mousemove="elementSelected=undefined" @click="add(search)" @mouseleave="e => e.target.classList.toggle('highlighted')">
                    <div class="content">
                        <i class="far fa-plus"></i><span>Añadir: </span><span class="search-value">{{search}}</span>
                    </div>
                </li>
            </ul>
            <span v-if="search==''" class="instructions">Empieza a escribir para buscar {{allowadd?' o añadir un nuevo registro':''}} </span>
        </div>
    </div>
</template>

<script>
    import ClickOutside from './clickOutside.js'
    export default {
        props: {
            title: {
                type: String,
                default: "title"
            },
            placeholder: {
                type: String,
                default: "Selecciona los elementos"
            },
            value: {
                type: Array
            },
            fkey: {
                type: String,
                default: '',
                required: true
            },
            data: {
                type: Array,
                required: true
            },
            allowadd: {
                type: Boolean,
                default: true
            },
            showOnFocus: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                elementSelected: undefined,
                search: "",
                dropActive: false,
                timer: undefined
            }
        },
        computed: {
            results() {
                if (this.search == "" && this.showOnFocus == false) {
                    return [];
                } else {
                    return this.data.filter(el => {
                        if (!this.value || !this.value.includes(el.id)) {
                            return el[this.fkey].toString().toLowerCase().includes(this.search.toLowerCase());
                        } else {
                            return false;
                        }
                    });
                }
            }
        },
        watch: {
            elementSelected() {
                if (this.$refs.list) {
                    if (this.$refs.list.scrollTop > this.elementSelected * 31) {
                        this.$refs.list.scrollTop = this.elementSelected * 31;
                    } else if (this.$refs.list.scrollTop + 155 < this.elementSelected * 31) {
                        this.$refs.list.scrollTop = (this.elementSelected * 31) - 155;
                    }
                }
            },
            search() {
                if (this.search == "" && this.showOnFocus == false) {
                    this.elementSelected = undefined;
                } else {
                    this.elementSelected = 0;
                }
            }
        },
        methods: {
            focus() {
                if (this.timer) clearTimeout(this.timer);
                if (this.showOnFocus && this.elementSelected == undefined) {
                    this.elementSelected = 0
                }
                // console.log("Focus");
                this.$refs.inputsearch.focus();
            },
            deleteElement(index) {
                let t = this.value;
                if (index > -1) {
                    t.splice(index, 1);
                }
                this.$emit('input', t);
                this.$emit('update:value', t);
                this.focus()
            },
            addElement(item) {
                if (this.timer) clearTimeout(this.timer);
                // console.log(this.value);
                let index = this.value.indexOf(item.id);
                if (index < 0) {
                    this.search = "";
                    let t = this.value;
                    t.push(item.id);
                    this.$emit('input', t);
                    this.$emit('update:value', t);
                    this.focus();
                }
            },
            showItem(id) {
                let it = this.data.find(el => el.id == id);
                return it ? it[this.fkey] : id;
            },

            keyListener(event) {
                if (event.keyCode == 8 && this.search == "") {
                    if (this.value.length) {
                        this.deleteElement(this.deleteElement(this.value.length - 1))
                    }
                } else if (event.keyCode == 27) {
                    this.click_outside();
                    let elems = this.$parent.$parent.$el.querySelectorAll('.focusable');
                    elems.forEach(function(el, i, array) {
                        if (event.srcElement == el) {
                            if (i - 1 < 0) {
                                elems[elems.length - 1].focus();
                                return;
                            } else {
                                elems[i - 1].focus();
                                return;
                            }
                        }
                    });
                    event.preventDefault();
                } else if (event.keyCode == 13 || event.keyCode == 9) {
                    if (event.keyCode == 9 || (!this.results.length && this.search == "")) {
                        this.click_outside();
                        let elems = this.$parent.$parent.$el.querySelectorAll('.focusable');
                        elems.forEach(function(el, i, array) {
                            if (event.srcElement == el) {
                                if (i + 1 == elems.length) {
                                    elems[0].focus();
                                    return;
                                } else {
                                    elems[i + 1].focus();
                                    return;
                                }
                            }
                        });
                    } else {
                        if (this.results.length) {
                            if (!this.elementSelected) this.elementSelected = 0;
                            this.addElement(this.results[this.elementSelected]);
                        } else if (this.allowadd && this.search != "") {
                            this.add(this.search);
                        }
                    }
                    event.preventDefault();
                } else if (event.keyCode == 38) {
                    if (this.elementSelected == undefined) this.elementSelected = -1;
                    this.elementSelected--;
                    if (this.elementSelected < 0) this.elementSelected = this.results.length - 1;
                    event.preventDefault();
                } else if (event.keyCode == 40) {
                    if (this.elementSelected == undefined) this.elementSelected = -1;
                    this.elementSelected++;
                    if (this.elementSelected > this.results.length - 1) this.elementSelected = 0;
                    event.preventDefault();
                }
            },
            highlightPhrase(text) {
                if (!this.search.length) return text
                return text.replace(new RegExp(this.search, "gi"), match => {
                    return `<strong>${match}</strong>`;
                });
            },
            click_show_drop(event) {
                console.log("On focus");
                this.dropActive = true;
                event.preventDefault();
            },
            click_outside() {
                this.search = "";
                this.dropActive = false;
            },
            blur() {
            },
            add(text) {
                let it = this.data.find(el => el[this.fkey] == text);
                if (!it && text != "") {
                    this.$emit('add', text);
                    this.search = "";
                }
            },
        },
        mounted() {
            this.search = "";
            if (this.value == undefined) {
                this.$emit('input', []);
                this.$emit('update:value', []);
            }
        },
        directives: {
            ClickOutside
        }
    }

</script>

<style lang="scss">
    .fmultiple {
        &.focus {
            border-color: rgba(0, 0, 0, .1) !important;
            background-color: #f0f0f0;

            label {
                opacity: .5;
                -webkit-backface-visibility: hidden;
                -moz-backface-visibility: hidden;
                backface-visibility: hidden;
            }
        }
        // display: contents;
        background-color: #fff;
        position: relative;
        border: 1px solid rgba(0, 0, 0, .07);
        border-radius: 2px;
        // padding-top: 7px;
        // padding-left: 12px;
        // padding-right: 12px;
        // padding-bottom: 4px;
        -webkit-transition: background-color .2s ease;
        transition: background-color .2s ease;

        label {
            font-family: Karla, sans-serif;
            font-size: 1em;
            margin: 0;
            display: block;
            opacity: 1;
            -webkit-transition: opacity .2s ease;
            transition: opacity .2s ease;
        }

        .selector{
         margin-top: -16px !important;
        .active {
            // margin-top: -16px;

            ul {
                li {
                    .element {
                        background-color: white;

                        i {
                            background-color: #fff;
                        }
                    }
                }
            }
        }
        }
        ul.list-selecteds {
            list-style: none;
            padding: 3px 3px 0px 3px;
            // border: 1px solid #f0f0f0;
            margin-bottom: 3px;

            li {
                display: inline-block;

                .element {
                    line-height: 26px;
                    background-color: #fff;
                    padding: 0px 10px 0px 1px;
                    ;
                    border-radius: 15px;
                    margin-right: 5px;
                    margin-bottom: 5px;

                    i {
                        float: left;
                        zoom: 1.2;
                        cursor: pointer;
                        padding: 3px 5px;
                        border-radius: 10px;
                        margin-right: 3px;
                        margin-top: 1px;

                        &:hover {
                            background-color: white;
                        }
                    }

                }

                input {
                    background-color: transparent;
                    border: none;
                    width: auto;
                     box-shadow: none !important;
                }

            }

        }

        .drop-panel {
            &.active {
                display: block;
            }

            position:absolute;
            display: none;
            background-color: red;
            // float: left;
            // width: calc(100% - (12px + 12px));
            width: 100%;
            padding: 10px;
            border: 1px solid rgba(0, 0, 0, .07);
            border-bottom: none;
            border-top: none;
            border-bottom-right-radius: 2px;
            border-bottom-left-radius: 2px;
            z-index: 8;
            margin-top: -2px;
            background: #fff;
            color: #000;
            border-radius: 0 0 4px 4px;
            -webkit-box-shadow: 0 4px 5px rgba(0, 0, 0, .15);
            box-shadow: 0 4px 5px rgba(0, 0, 0, .15);

            input {
                background: #fff !important;
                vertical-align: baseline;
                line-height: 28px;
                border-radius: 2px;
                border: none;
                font-size: 1em;
                // border: 1px solid rgba(0, 0, 0, .07);
                width: 100%;
                height: auto !important;
                min-height: 26px;
                padding: 4px 20px 4px 5px;
                margin: 0;
                outline: 0;
                box-shadow: none !important;
            }




            ul.data-elements {
                margin: 3px 10px 10px 3px;
                padding: 0px;
                list-style: none;
                max-height: 200px;
                padding: 0 0 0 4px;
                margin: 4px 4px 4px 0;
                position: relative;
                overflow-x: hidden;
                overflow-y: auto;
                -webkit-tap-highlight-color: transparent;

                li {
                    div.content {
                        padding: 3px 7px 4px;
                        margin: 0;
                        cursor: pointer;
                        min-height: 1em;
                        display: block;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        float: none;
                        width: auto;

                        i {
                            zoom: .9;
                            margin-right: 10px;
                        }

                        .search-value {
                            font-weight: bold;
                        }

                        .highlightText {
                            font-weight: bold;
                        }
                    }

                    color: #626262;
                    list-style: none;
                    display: list-item;
                    background-image: none;
                    padding-left: 3px;
                    line-height: 24px;

                    &.highlighted {
                        background: #f0f0f0;
                        border-radius: 3px;
                    }
                }
            }
        }

        .selector {
            margin: 0px;
            width: 100%;
            position: relative;

            &.active {
                background-color: #f0f0f0;
            }

            a {
                display: block;
                color: #444;
                line-height: 35px;
                height: 35px;
                width: 100%;
                padding: 3px 9px;

                span {
                    margin-right: 42px;
                    display: block;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    float: none;
                    width: auto;
                    line-height: 30px;
                    height: 30px;
                }

                i {
                    display: inline-block;
                    width: 18px;
                    height: 100%;
                    cursor: pointer;
                    position: absolute;
                    zoom: 1.1;

                    &.fa-times {
                        right: 24px;
                        top: 8px;
                        text-decoration: none;
                        border: 0;
                        outline: 0;
                        margin-right: 0px;
                    }

                    &.fa-sort-down {
                        right: 5px;
                        top: 6px;
                        left: auto;
                        background: 0 0;
                        border-left: 0;
                    }
                }
            }
        }
    }

</style>
