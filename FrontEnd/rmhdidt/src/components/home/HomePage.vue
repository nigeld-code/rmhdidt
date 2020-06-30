<template>
  <div id="home">
    <div class="home-content">
      <transition name="grid-selector-transition" mode="out-in">
        <i
          key="diamondList"
          v-if="gridSelectorToggle"
          class="grid-selector nld-DiamondList"
          @click="gridSelectorToggle = !gridSelectorToggle"
        ></i>
        <i
          key="diamondGrid"
          v-if="!gridSelectorToggle"
          class="grid-selector nld-DiamondGrid"
          @click="gridSelectorToggle = !gridSelectorToggle"
        ></i>
      </transition>
      <transition name="grid-selector-transition" mode="out-in">
        <svg
          v-if="gridSelectorToggle"
          key="tileGrid"
          id="tileGrid"
          width="100%"
          height="100%"
          viewBox="0 0 1000 550"
          version="1.1"
          style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
        >
          <g
            v-for="(tileData, index) in data"
            :key="tileData._id"
            :transform="
              'translate(' +
                tileData.xPos +
                ' ' +
                (
                  +tileData.yPos -
                  tileData.growHover * 0.75 -
                  tileData.heightClick
                ).toString() +
                ') scale(' +
                tileData.scale +
                ')'
            "
          >
            <path
              :d="
                'M112,127l-111,-64l0,' +
                  (tileData.height + tileData.growHover + tileData.growClick) +
                  'l111,64l0,-' +
                  (tileData.height + tileData.growHover + tileData.growClick) +
                  'Z'
              "
              :style="'fill:' + tileData.leftWallColor"
            />
            <path
              :d="
                'M222,63l-111,64l0,' +
                  (tileData.height + tileData.growHover + tileData.growClick) +
                  'l111,-64l0,-' +
                  (tileData.height + tileData.growHover + tileData.growClick) +
                  'Z'
              "
              :style="'fill:' + tileData.rightWallColor"
            />
            <title>{{ tileData.title }}</title>
            <use
              :xlink:href="'#_Image' + index"
              x="0"
              y="0"
              width="512px"
              height="512px"
              :transform="tileData.randomRotation"
              class="tile-top"
              @mouseover="hoverToggleTile(index, true, tileData.growHover)"
              @mouseleave="hoverToggleTile(index, false, tileData.growHover)"
              @click="activateClickTileTrigger(index)"
            />
            <defs>
              <image
                :id="'_Image' + index"
                width="128px"
                height="128px"
                :xlink:href="tileData.tileImage"
              />
            </defs>
          </g>
        </svg>
        <div v-if="!gridSelectorToggle" key="tileList" id="grid-list-container">
          <div v-for="tileData in data" :key="tileData._id" class="grid-links">
            <router-link
              :to="{
                name: 'display',
                params: { id: tileData._id }
              }"
              tag="div"
            >
              <div
                class="grid-list"
                :style="'border: 8px solid' + tileData.rightWallColor + ';'"
                :title="tileData.title"
              >
                <img
                  :src="tileData.tileImage"
                  class="tile-list-image"
                  :style="
                    'box-shadow: 0 4px 8px 0 ' +
                      tileData.rightWallColor +
                      ', 0 6px 20px 0 ' +
                      tileData.leftWallColor +
                      ';'
                  "
                />
                <div class="grid-list-text">
                  {{ tileData.title }}
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        clickTileTrigger: false,
        gridSelectorToggle: null
      };
    },
    computed: {
      data() {
        return this.$store.getters.allTiles;
      }
    },
    created() {
      if (window.innerWidth <= 700) {
        this.gridSelectorToggle = false;
      } else {
        this.gridSelectorToggle = true;
      }
    },
    mounted() {
      if (this.data === null) {
        this.$store.dispatch("loadTiles");
      } else {
        this.data.forEach(tile => {
          tile.heightClick = 0;
          tile.growClick = 0;
          tile.growHover = 0;
        });
      }
      window.addEventListener('resize', this.resizeEvent);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resizeEvent);
    },
    methods: {
      hoverToggleTile(index, toggle, grow) {
        if (!this.clickTileTrigger) {
          this.animate({
            timing: timeFraction => {
              if (toggle) {
                return Math.pow(timeFraction, 2);
              } else {
                return Math.pow(1 - timeFraction, 2);
              }
            },
            draw: progress => {
              if (grow !== 0) {
                if (toggle) {
                  this.data[index].growHover = progress * (10 - grow);
                } else {
                  this.data[index].growHover = progress * grow;
                }
              } else {
                this.data[index].growHover = progress * 10;
              }
            },
            duration: 100
          });
        }
      },
      activateClickTileTrigger(index) {
        if (this.clickTileTrigger === false) {
          const dropAmount = 450;
          const raiseTo = 8;
          this.clickTileTrigger = true;
          let routerTrigger = false;
          this.animate({
            timing: timeFraction => {
              return Math.pow(timeFraction, 2);
            },
            draw: progress => {
              this.data.forEach(tile => {
                if (tile === this.data[index]) {
                  tile.heightClick = (
                    progress *
                    (tile.yPos - raiseTo)
                  ).toString();
                  tile.growClick =
                    progress * dropAmount * 1.333 + +tile.heightClick * 1.333;
                } else {
                  tile.heightClick = (-progress * dropAmount).toString();
                }
                document.querySelector("#tileGrid").style.opacity =
                  1 - progress * 0.5;
                if (progress === 1 && !routerTrigger) {
                  routerTrigger = true;
                  this.$router.push({
                    name: "display",
                    params: { id: this.data[index]._id }
                  });
                }
              });
            },
            duration: 800
          });
        }
      },
      animate({ timing, draw, duration }) {
        let start = performance.now();
        requestAnimationFrame(function step(time) {
          let timeFraction = (time - start) / duration;
          if (timeFraction > 1) {
            timeFraction = 1;
          }
          let progress = timing(timeFraction);
          draw(progress);
          if (timeFraction < 1) {
            requestAnimationFrame(step);
          }
        });
      },
      resizeEvent() {
        if (window.innerWidth <= 700) {
          this.gridSelectorToggle = false;
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "../../styles/_variables";

  .grid-selector {
    position: absolute;
    color: map-get($colors, default-border);
    top: 1.5rem;
    left: 1rem;
    font-size: 1.75rem;
    cursor: pointer;
    transition: color 350ms;

    &:hover {
      color: map-get($colors, secondary-text);
    }

    @media (max-width: $dropdown-min-width) {
      display: none;
    }
  }

  .grid-selector-transition-enter {
    opacity: 0;
  }

  .grid-selector-transition-enter-active,
  .grid-selector-transition-leave-active {
    transition: opacity $default-toggle-animation-duration ease-in;
  }

  .grid-selector-transition-leave-to {
    opacity: 0;
  }

  #home {
    .home-content {
      position: relative;
      padding-top: 2rem;
      margin-left: 0.5rem;
      margin-right: 0.5rem;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
    }

    .tile-top {
      cursor: pointer;
    }
  }

  #grid-list-container {
    margin-top: 1.5rem;

    @media (max-width: $dropdown-min-width) {
      margin-top: 0;
    }

    @media (max-width: $minimum-min-width) {
      text-align: center;
    }

    .grid-links {
      @media (max-width: $minimum-min-width) {
        display: inline-block;
      }
    }

    .grid-list {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      padding: 2rem;
      margin: 1rem;
      align-content: space-between;
      border-radius: 16px;
      cursor: pointer;

      &:hover {
        box-shadow: 0 3px 3px 0 map-get($colors, default-text);
      }

      @media (max-width: $minimum-min-width) {
        padding: 0;
        margin: 0.25rem;
      }
    }

    .grid-list-text {
      padding: 1rem;
      font-size: 6rem;
      color: map-get($colors, default-text);
      line-height: 5rem;
      padding-left: 1.5rem;

      @media (max-width: $dropdown-min-width) {
        font-size: 3rem;
        line-height: 2rem;
      }

      @media (max-width: $minimum-min-width) {
        display: none;
      }
    }

    .tile-list-image {
      height: 8rem;
      border-radius: 8px;

      @media (max-width: $dropdown-min-width) {
        height: 4rem;
      }

      @media (max-width: $minimum-min-width) {
        height: 5rem;
      }
    }
  }
</style>