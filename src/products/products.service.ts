import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger('ProductsService');
    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to the database');
    }

    create(createProductDto: CreateProductDto) {
        return this.product.create({
            data: createProductDto,
        });
    }

    async findAll(paginationDto: PaginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const totalPages = await this.product.count({
            where: { available: true },
        });
        const lastPage = Math.ceil(totalPages / limit);

        return {
            data: await this.product.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: { available: true },
            }),
            pagination: {
                page,
                total: totalPages,
                lastPage,
            },
        };
    }

    async findOne(id: number) {
        const product = await this.product.findUnique({
            where: { id, available: true },
        });

        if (!product) {
            throw new RpcException({
                status: HttpStatus.NOT_FOUND,
                message: `Product #${id} not found`,
            });
        }

        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, ...data } = updateProductDto;
        await this.findOne(id);

        return this.product.update({
            where: { id },
            data,
        });
    }

    async remove(id: number) {
        await this.findOne(id);

        // This is hard delete --->
        // return this.product.delete({
        //     where: { id },
        // });

        // This is soft delete --->
        return await this.product.update({
            where: { id },
            data: { available: false },
        });
    }
}
