<template>
<div class="type-contact-tags">
    <vue-tags ref="typeContact" :active="type" :all="allTags" :element-count-for-start-arrow-scrolling="3" :tab-index="1" :tag-color-default="'#30A0EE'" :colors-enabled="true" :tag-list-label="$t('Select_an_option')" :placeholder="$t('Select_an_option')" @on-tag-removed="onTagRemoved" @on-tag-added="onTagAdded" />
	</div>
</template>

<script>
    export default {
        props: ['type'],
        data() {
            return {
                allTags: [{
                    "id": 0,
                    "name": this.$t("Client"),
                    "slug": "client"
                }, {
                    "id": 1,
                    "name": this.$t("Expert"),
                    "slug": "expert"
                }, {
                    "id": 2,
                    "name": this.$t("Provider"),
                    "slug": "provider"
                }]
            }
        },
        methods: {
            onTagRemoved(tag) {
                let newVal = this.type.filter((t) => t.id != tag.id);
                this.$emit('update:type', newVal);
                this.$refs.typeContact.handleClickOutsideTagList({
                    target: {
                        closest() {}
                    }
                });
            },
            onTagAdded(val) {
                if (!this.type.includes(val)) {
                    let newVal = this.type;
                    newVal.push(val)
                    this.$emit('update:type', newVal);
                    this.$refs.typeContact.handleClickOutsideTagList({
                        target: {
                            closest() {}
                        }
                    });
                }
            }
        }
    }
</script>

<style lang="scss">
	.type-contact-tags {
		.tags {
			width:100%;
			.tags__search{
				border: none;
			}
		}
		margin-bottom:15px;
	}
</style>
